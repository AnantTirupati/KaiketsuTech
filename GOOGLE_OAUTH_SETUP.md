# Google OAuth Setup Guide for KaiketsuTech

This document provides setup instructions for configuring Google OAuth with Supabase for local development and production. No credentials need to be hardcoded in the codebase; instead, everything is configured via environment variables and the Supabase Dashboard.

---

## Step 1: Configure Google Cloud Console

To use Google Sign-In, you need to create a project in the Google Cloud Console and generate client credentials.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Search for **APIs & Services** and select **OAuth consent screen**:
   - Select **External** User Type and click **Create**.
   - Fill in the required App Information (App name, User support email, Developer contact information).
   - Click **Save and Continue** through the scopes and test users sections.
4. Go to the **Credentials** tab:
   - Click **+ Create Credentials** at the top and select **OAuth client ID**.
   - Select **Web application** as the Application type.
   - Set the name (e.g., `KaiketsuTech Dev`).
   - Under **Authorized redirect URIs**, add your Supabase redirect URI. You can find this in your Supabase project dashboard under **Auth > Providers > Google**. The format is usually:
     ```
     https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
     ```
   - Click **Create**.
5. Copy the generated **Client ID** and **Client Secret**.

---

## Step 2: Configure Google Provider in Supabase

1. Go to your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Navigate to **Auth** in the sidebar, then click on **Providers**.
3. Locate **Google** in the list and expand the section:
   - Toggle **Enable Google Provider** to **ON**.
   - Paste the **Client ID** and **Client Secret** copied from the Google Cloud Console.
   - Click **Save**.

---

## Step 3: Configure Redirect URLs in Supabase

To support seamless redirects for both `localhost` (development) and your custom domain (production), configure the redirect settings in Supabase:

1. In your Supabase Dashboard, navigate to **Auth > URL Configuration**.
2. Set the **Site URL** to your production domain (or localhost for development):
   - Example: `http://localhost:3000` or `https://kaiketsutech.com`
3. Under **Redirect URLs**, add URLs that your application is allowed to redirect to after successful authentication:
   - For Localhost Development: `http://localhost:3000/auth/callback`
   - For Production: `https://<your-production-domain>.com/auth/callback`
4. Click **Save**.

---

## Step 4: Configure Local Environment Variables

Ensure your `.env.local` contains the correct public credentials for Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production deployments (Vercel, Netlify, etc.), simply update `NEXT_PUBLIC_SITE_URL` to your live domain (e.g. `https://kaiketsutech.com`) and configure the environment variables in your deployment platform settings.

---

## Troubleshooting

- **Error: Redirect URI Mismatch**: Ensure that the Authorized Redirect URI set in the Google Cloud Console exactly matches the callback URL shown in your Supabase Dashboard under Auth Providers.
- **Login Loop / Refresh issues**: Double check that the domain configuration under URL Settings in Supabase matches your active application environment exactly.
