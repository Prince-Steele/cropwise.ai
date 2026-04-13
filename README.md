# Agrisense

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.13.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Recovering Local Setup

If you cloned this from a teammate after the hackathon, the repo-side pieces you still need are:

1. Install dependencies in both app folders:
   `npm install`
   `cd backend && npm install`
2. Create a backend env file from [backend/.env.example](backend/.env.example):
   `copy backend\\.env.example backend\\.env`
3. Fill in the real values for:
   `SUPABASE_URL`
   `SUPABASE_SERVICE_ROLE_KEY`
   `GEMINI_API_KEY`
   `FRONTEND_URL`
   `COMMODITIES_API_KEY` if you decide to restore the external price API
4. Replace the placeholder frontend values in:
   `src/environments/environment.ts`
   `src/environments/environment.prod.ts`
   Required values:
   `supabaseUrl`
   `supabaseAnonKey`
   production `apiBaseUrl`
5. Recreate or reconnect the Supabase project schema using the SQL in:
   `backend/supabase_schema.sql`
   `supabase/migrations/20260315170751_initial_schema.sql`
6. Run the setup check:
   `npm run check:setup`

Notes:
- The current routed login/signup flow uses mock auth for local UI access.
- Saving recommendation history still needs a real Supabase project and valid auth tokens.
- Google OAuth only matters if you want to restore real Supabase social login.
