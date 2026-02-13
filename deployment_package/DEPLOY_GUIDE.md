# How to Deploy Your Prototype (No Coding Required)

Your application is ready to go live! Follow these simple steps to host it for free.

## Step 1: Locate Your Build File
I have created a special folder for you called `deployment_package` inside your project directory.
Inside it, you will find a file named **`collabcrm_prototype.zip`**.

1.  Open your File Explorer / Finder.
2.  Navigate to: `/home/yashang/.gemini/antigravity/scratch/collabcrm-ai-studio/deployment_package`
3.  You will see a folder named **`dist`** and a zip file.

## Step 2: Use Netlify Drop (Free Hosting)
We will use a service called Netlify to host your site. You don't even need an account to test it, but creating a free one keeps the site online permanently.

1.  Open your web browser and go to: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2.  You will see a box that says "Drag and drop your site folder here".
3.  **Simplest Method**: Just drag and drop the **`dist` folder** directly into that box. (You don't even need to unzip anything!)

## Step 3: View Your Live Site
1.  Netlify will upload your files instantly.
2.  Once the upload bar turns green, you will see a link (e.g., `random-name-12345.netlify.app`).
3.  Click that link. **You are now live!**
4.  Share this link with anyone to show them the prototype.

## How to Update Your Site
If you make changes to the code and want to update the live version:
1.  Ask me to "Build the project again".
2.  I will update the **`collabcrm_prototype.zip`** file for you.
3.  Go back to your **Netlify** link (or the "Deploys" tab if you created an account).
4.  Drag and drop the **new** `dist` folder again.
5.  The site will update instantly!

---
> **Note**: Since this is a prototype, all data (users, projects, bugs) is stored in your browser's "Local Storage". If you open the link on a different computer or clear your history, the data will reset to default. This is perfect for demos!

## Want to save this to GitHub? (Source Code)
I have created a special zip file for this purpose: **`collabcrm_full_source.zip`**.

### Option 1: GitHub Desktop (Windows/Mac)
1.  **Unzip** `collabcrm_full_source.zip`.
2.  Open GitHub Desktop -> "Add Local Repository".
3.  Publish!

### Option 2: Linux / Ubuntu (Web Upload)
Since you are on Ubuntu, this is the easiest way:
1.  **Unzip** `collabcrm_full_source.zip` completely.
2.  Go to your new GitHub Repository page in your browser.
3.  Click the link **"uploading an existing file"** (it's usually small text near the top or bottom).
4.  **Drag and drop** all the files/folders from your unzipped folder into the browser window.
5.  Wait for them to upload.
6.  Click **"Commit changes"** (green button).

> **Tip**: If it says "Too many files", try dragging them in smaller batches (e.g. just the `src` folder first, commit, then the rest).

## How to Connect to Vercel (Recommended)
Since your code is now on GitHub, you can link it to Vercel for automatic updates.

1.  Go to **[Vercel Dashboard](https://vercel.com/dashboard)**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Click **"Import"** next to your `Client-Portal-Revamp` repository.
4.  Leave settings as default (Framework: Vite).
5.  Click **"Deploy"**.

> **Troubleshooting**: If you don't see your repository in the list (like "No Results Found"):
> 1. Click the **"Configure GitHub App"** button.
> 2. It will open a GitHub page. Scroll down to "Repository access".
> 3. Select **"All repositories"** (easiest) or search for `Client-Portal-Revamp`.
> 4. Click **"Save"**.
> 5. Back on Vercel, the repo will appear!

Your site will be live in ~1 minute! Every time you `git push` in the future, Vercel will update your site automatically.
