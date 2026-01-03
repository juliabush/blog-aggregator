# Blog-Aggregator Backend

A multi-user blog aggregator that collects and displays posts from RSS feeds in real time. Users can add, follow, and browse feeds, with automatic background scraping and post updates.

## Commands Avaliable

- `login` — Log in as an existing user.
- `register` — Create a new user account.
- `reset` — Reset the database to a clean state.
- `users` — List all registered users.
- `agg` — Start the feed aggregator (scrapes feeds at set intervals).
- `addfeed` — Add a new RSS feed (must be logged in).
- `feeds` — Display all available feeds.
- `follow` — Follow a specific feed (must be logged in).
- `following` — View the feeds you’re currently following (must be logged in).
- `unfollow` — Unfollow a feed (must be logged in).
- `browse` — Browse the latest posts from the feeds you follow (must be logged in).

<!-- this is the format for writitng a code block in markdown -->
<!-- specifying the language on the same line results in syntax highlighting -->

```js
console.alert("Hello");
```

<!-- what is the language to add to this for synatx highlighting -->
<!-- or is that not necessary -->

```bash
npm run start login <username>
```

The login command takes only one additional argument of username. This must be passed in, or else it will throw an error. It fetches this user
from the database. If they dont exist, it throws an error. It also sets
the user as logged in.

```bash
npm run start register <username>
```

The register command takes only one additional argument of username. This must be passed in. If the user already exists it throws an error.
If the user doesn’t exist, it registers a new user and automatically logs them in.

```bash
npm run start reset
```

The reset command deletes all the Users in the users table. This action
cannot be undone - use with caution! In case of an error, process will
exit with code 1 and display and error message.

```bash
npm run start users
```

The users command lists all registered users from the database. Marks the currently logged in user with (current).

```bash
npm run start agg <interval>
```

The agg command scrapes fields at set intervals. You must provide an argument interval, provided in a time unit of ms, s, m, h. e.g: 10ms, 20s, 1m, 1h.

```bash
npm run start addfeed <title> <url>
```

The addFeed command requires two arguments. One of them is a title for the given RSS field, the other is the url of that website. Adds a new RSS feed and automatically follows it. Must be logged in.

```bash
npm run start feeds
```

The feeds command lists all feeds for a given user.

```bash
npm run start follow <url>
```

The follow command allows a user to follow a specific feed. You must be logged in. You are required to pass a url argument.

```bash
npm run start following
```

The following command displays the feeds you are currently following.

```bash
npm run start unfollow <feed-url>
```

The unfollow command allows you to stop following a feed. The user must be currently logged in.

```bash
npm run start browse <limit>
```

The browse command allows you to find the feeds of a given user. The user must be logged in. You can provide a limit value, or it will default to the value of 2.
