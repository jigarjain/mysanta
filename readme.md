# mysanta

This is a source code of web app which was India's first online secret santa.

##Requirements
- Mongodb >= 2.4.0
- Node >= 0.11

##Installation
 - `git clone git@github.com:jigarjain/mysanta.git mysanta`
 - `cd mysanta`
 - `npm install`
 - `bower install`

##Configuration
Configuration files are inside the ***cfg*** directory. The base configuration
is in ***cfg/index.js***. The `NODE_ENV` environment variable determines which
file inside ***cfg*** will extend the default config.

## Run web app
- `node --harmony index.js`

The website will be running on [localhost:5060](http://localhost:5060). You can also use `forever`

## Testing
- Test cases to be written
