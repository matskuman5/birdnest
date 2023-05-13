# Birdnest - [Reaktor Developer Trainee pre-assignment 2023](https://assignments.reaktor.com/birdnest/)

## Check it out in action at https://birdnest-matskuman5.fly.dev!

The app gets drone location data from an API in real-time. Drones passing within 100 m of an endangered bird's nest are detected, and their owner's info is shown in the 'Violators' list. Violations are stored for 10 minutes, after which they're deleted. The site immediately shows gathered violator data once you open it.

### Implementation

The backend is built on Node.js. Axios is used to get data from the API (using [xml-js](https://www.npmjs.com/package/xml-js) for XML parsing) and Express is used to provide data to the frontend. The frontend is a simple React app that gets data from the backend in real-time with Axios and shows drone and violator data. Hosting is provided by [fly.io](https://fly.io/), using a GitHub Action to automatically combine back- and frontend and deploy whenever I push onto the master branch.

At one point I also used MongoDB to store violators in case the app was shut down or crashed. This turned out to be a bit complicated and caused some issues with asynchronization of data, and after some thinking - and a careful re-read of the assignment instructions - I just decided to store the violator data as a local variable in the backend.

The frontend is quite bare, but functional. I at least used MaterialUI to make the tables look a bit nicer. :)
