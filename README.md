## Circutor Technical Test

This is a very simple application that shows some energy data Helsinki buildings from 1st January 2021 to around 28 Feb 2022.

It has an API written in GO and a frontend written in React. It uses the UI library ant design (https://ant.design/)

## Launch

Clone/Fork the repo with git clone <url>
Build the docker containers and launch the project with:
```sh
docker-compose up --build
```

The api is accessible on `http://localhost:1234/docs/index.html`
The frontend is accessible on `localhost:3001`

## Tasks

### Programming
- Implement an error message when login fails
- Implement a small test for this new feature
- Change the border radius of all components (button, input, ...)
- Change the default color from blue to green

Feel free to implement any other improvement as long as you write a test for it.

### Writing (modify this readme)
#### Write in this all red flags that you find in the code. Any examples that would stop a code review. If you want to fix some of them, go on.

Answer: 

1. **Unused files.** There are files: `/web/src/app/layouts/style.js, /web/src/app/{App.jsx,App.css}` are unused, I would suggest to remove it or use it where it is needed.
2. **Why two App's?** Related to the previous *flag*, having both `App.{js,jsx}` makes it really confusing to guess which file is actually loaded.
3. **Layout routes.** How the router is configured forces every *route* to render common elements. And gives zero information wether it is a protected route or not. I would recommend using the [layout routes](https://reactrouter.com/en/main/route/route#layout-routes) in order to avoid duplicated code and make nested routing more reasonable. Using layout routes, we could have two layouts *one for logged users and one for non logged users* and then the pages for each layout: bookmarks, buildings and metrics; register and login, respectively. Where the layouts may handle the logic of checking, if needed, user and render base elements.
4. **Login check logic.** All routes that are *protected* use almost the same logic for checking if the token is in the localStorage and is valid. This a clear candidate for a custom hook in the `/web/src/hooks` so all routes that need that logic could reuse it.
5. **Calling one fetch after the other.** In `/web/src/layouts/{buildings_list.js,bookmarks_list.js}` there are many places where `GetBuildings,GetBookmarks,DeleteBookmarks` functions are called one after the other. So after one request is finished, next one will be fired. This will affect performance and increment times until the user sees data. To prevent this we can use `Promise.all()` API so all requests are fired concurrently and one does not wait for the other, and time is saved! There is one example in `/web/src/layouts/bookmakrs_list.js` on how it could be done. In fact, there is another one case in `/web/src/layouts/buildings_list.js` where it uses `setBuildings(data)` and could be repleaced with ease updating the state after all data is available and would work the same.
6. **Reduce, recude, reduce.** In files `/web/src/layouts/bookmakrs_list.js` and `/web/src/layouts/buildings_list.js` there is a couple of times the same reduce, where transforms the array of buildings into a map that has the id's of buildings and contains the name for that building for each one.
7. **Components.** The table in `/web/src/layouts/bookmakrs_list.js` and `/web/src/layouts/buildings_list.js` is almost close to be the same. I would create a custom component so most of the behaviour can be reused. Since there is only one column that changes it would provide a default render method and a prop to override it.


#### How you would make this application maintainable and scalable. Write here all the steps you would take.

Answer:

## Test submission

Please, submit this test as a new repository (a fork or a new one) in any free platform you want (bitbucket, gitlab, github, ..)
