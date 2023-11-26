import * as express from 'express';
import * as path from 'path';
import * as morgan from 'morgan'; // Import Morgan
import Stripe from 'stripe';

//import * as livereload from 'livereload';
//import * as connectLivereload from 'connect-livereload';


import { Express, Request, Response } from 'express';
import { authRoute, authCallbackRoute } from './routes/auth';

import * as session from 'express-session';
import { SessionState } from './database/session-state';
import { usernameRoute } from './routes/user-info';
import { getBugReportRoute, sendBugReportRoute } from './routes/bug-report';
import { Database } from './singletons/database';
import DiscordBot from './singletons/discord-bot';
import { getGameRoute, getGamesByPlayerRoute, sendGameRoute } from './routes/game';
import { getGlobalStatsRoute } from './routes/global-stats';
import { LeaderboardType } from './database/leaderboard/leaderboard-schema';
import { getLeaderboardAccuraciesRoute, getLeaderboardRoute } from './routes/leaderboard';
import { stripeWebhook } from './routes/stripe';
import * as bodyParser from 'body-parser';


declare module 'express-session' {
    export interface SessionData {
      state?: SessionState; // Add your custom session properties here
      redirect?: string;
    }
  }

// TypeScript interface for extended request
interface ExtendedRequest extends Request {
    rawBody: string;
  }

require('dotenv').config();

export default async function createApp(): Promise<Express> {
    const app = express();
    const clientDir = path.join(__dirname, '../../public');

    app.use(morgan('dev'));

    app.use(session({
        secret: process.env['SESSION_SECRET']!,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // for HTTPS. set secure to false if using HTTP
    }));

    // set response to json
    app.use(express.json({limit: '50mb'}));

    // connct to MongoDB
    const database = new Database();
    await database.connect();

    // connect to discord
    const discordBot = new DiscordBot();
    const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']!);


        // In development, refresh Angular on save just like ng serve does
    let livereloadServer: any;
    if (process.env['NODE_ENV'] !== 'production') {

        import('livereload').then(livereload => {
                const livereloadServer = livereload.createServer();
                livereloadServer.watch(clientDir);
                livereloadServer.once('connection', () => {
                    setTimeout(() => livereloadServer.refresh('/'), 100);
                });
            });

            import('connect-livereload').then(connectLivereload => {
                app.use(connectLivereload());
            });
    }

    app.use(express.static(clientDir));
    app.get('/api/stackrabbit', async (req: Request, res: Response) => {
        const url = req.query['url'];
        console.log("Making request to Stack Rabbit API:", url);

        const result = await fetch(url as string);

        try {
            const json = await result.json();
            res.send(json);
        } catch (e) {
            console.log("Error parsing JSON from Stack Rabbit API:", e);
        }
        console.log(result.status);
    });

    app.get('/api/auth', authRoute);
    app.get('/api/auth/callback', authCallbackRoute);
    app.get('/api/username', usernameRoute) // FAST, does not require database lookup

    app.post('/api/send-bug-report', (req: Request, res: Response) => sendBugReportRoute(discordBot, req, res));
    app.get('/api/get-bug-report', (req: Request, res: Response) => getBugReportRoute(req, res));

    app.post('/api/send-game', (req: Request, res: Response) => sendGameRoute(req, res));
    app.get('/api/get-game', (req: Request, res: Response) => getGameRoute(req, res));
    app.get('/api/get-games-by-player', (req: Request, res: Response) => getGamesByPlayerRoute(req, res));

    app.get('/api/get-global-stats', async (req: Request, res: Response) => getGlobalStatsRoute(req, res));

    app.get('/api/get-leaderboard-overall', async (req: Request, res: Response) => getLeaderboardRoute(req, res, LeaderboardType.OVERALL));
    app.get('/api/get-leaderboard-29', async (req: Request, res: Response) => getLeaderboardRoute(req, res, LeaderboardType.START_29));
    app.get('/api/get-leaderboard-accuracy-overall', async (req: Request, res: Response) => getLeaderboardAccuraciesRoute(req, res, LeaderboardType.OVERALL));
    app.get('/api/get-leaderboard-accuracy-29', async (req: Request, res: Response) => getLeaderboardAccuraciesRoute(req, res, LeaderboardType.START_29));

    app.use(
        '/webhook',
        bodyParser.json({
          verify: (req: Request, res: Response, buf: Buffer, encoding: string) => {
            (req as ExtendedRequest).rawBody = buf.toString();
          },
        })
      );

    app.post('/webhook', async (req: Request, res: Response) => stripeWebhook(req, res, stripe));

    // catch all invalid api routes
    app.get('/api/*', (req, res) => {
        res.status(404).send("Invalid API route");
    });

    // Catch all routes and return the index file
    app.get('/*', (req, res) => {
      res.sendFile(path.join(clientDir, 'index.html'));
    });

    return app;
}