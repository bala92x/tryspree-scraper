# tryspree-scraper
Node.js based windows service to scrape new deals form tryspree.com, and send notification emails.

The application expects a `.env` file in the root directory with the following environment variables:

```
PORT=

SMTP_SERVICE=
SMTP_USERNAME=
SMTP_PASSWORD=

MAIL_FROM=
MAIL_TO=

PATH_TO_START_SCRIPT=
```
