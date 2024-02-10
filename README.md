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

1. ***Mantainability***
1.1: ***Tooling***: 
1.1.1: ***lint***: The choice would be [eslint](https://eslint.org/) and a set of [rules](https://github.com/dustinspecker/awesome-eslint?tab=readme-ov-file#configs-by-well-known-companiesorganizations) that we feel comfortable as a team. That way we ensure at all times we write functional code at build time. We may, for example, create a rule that a file must not be greater than 100 lines. That way, we enforce everyone to write smaller files, that tend to be easier to mantain, test and read.
1.1.2: ***format*:** Another tool I would implement is [prettier](https://prettier.io/) so we can establish our way of formatting files. That way we could format any file and would look consistent within the rest. Moreover, it would save tons of time as we wouldn't be doing it by hand.
1.1.3: ***commit***: Last tool I would add is [husky](https://typicode.github.io/husky/), which is a powerfull tool to run a script before or after git events. For example, to run *prettier* and *eslint* right before our commit. If it fails, no commit will be made.
1.2: ***Project structure***:
1.2.1: ***routing***: As I mentioned earlier, I would split the routes in two segments: logged routes and non-logged routes. That way we could implement one layout for each so common navigation menu, base style and functionality is not duplicated. Layouts would be in `/web/src/app/layouts`.
1.2.2: ***pages***: Since we have layouts the next step is to create the pages directory and realocate all files in layouts with new files. That way we have a clearer vision and makes it easier to reason. If we have to think on nesting routes deeper than we have now. For example, imagine a route like /buildings/:buildingId/config, we would need to create subfolders inside the pages directory. That way, we would have a routing style "*similar*" to NextJS. Pages would be in `/web/src/app/pages`.
1.2.3: ***components***: Since the application looks promising and we propably will need to create and reuse components. I would create a components folder at the same level, that way we could for example extract our custom Table mentioned earlier. Components in `/web/src/app/components`.
1.2.4: ***hooks***: In the first step of this section we mentioned common behaviour, that is hooks! So for example we would have a hook that checks if the user has the *jwt* token in the localStorage and redirect to login if needed. That would be used by tha LoggedInLayou for example. Inside `/web/src/app/hooks`
1.2.5: ***lib/utils***: I would also add a lib or utils folder just to add here some utilities to use throughout the app. Things like the reduce function, mentioned earlier, used in multiple files and *string* formatting, date manipulation, etc. `/web/src/app/utils`.
1.3: ***automation***: Even thought we already added *husky* which includes automation. I would also create a pipeline that runs all tests, and builds our image to be deployed to some environment. We could have a QA environment, for us to test like it is production.

2. ***Scalability***
2.1: ***Performance***: I mentioned earlier some performance optimizations we could make. For example, concurrent API calls. If needed, we could make our code use the caching hooks such as `useCallback` and `useMemo` or the `memo` function provided by react. That step is a bit tricky, because those optimizations usually are not needed and is fine to just skip them. The key here is to know when and where to use. For example a big function that uses lots of reactive variables which don't change a lot is a good candidate to be wrapped in a `useCallback`.
2.2: ***Lazy load***: If needed, I would make most of the user interface to lazy load it's files on demand. It will reduce the worst thing of SPA's which is loading tons of JavaScript from the very begining. That causes multiple problems. Network usage, our application size may vary from a couple of KBs to more than a MB. That may cause our users to wait for 1 second or more to be able to see something on the screen. This is a lot of time in the web. To make matters worse, our user may get JS code that will never run! So, to load small chunks of our application in demand would cause a much better and fluid experience.
2.3: ***CDN***: Since our application is a SPA, we just need to send mainly JS files. I would make use of a CDNs which just serves our files in better timings. 
2.4: ***Regions***: Depending on our user base I would deploy de application on different regions arround the world so the expirience would be much faster and better. For example, if we have mainly users from Europe and Latin America would be a good choice to deploy our app in France or Germany and Mexico.
2.5: ***Horizontal scaling***: That would be done on the backend side. Adding new instances of our backend, would be effective to supply our users on high demand periods. In addition, implement a load balancer to direct the traffic to the desired instance based on policies. After the spike has been undertaken the service should establish to normal state.
2.6: ***Caching***: Storing frequently requested data from previous processes will save work and resources, that may include files, responses from server, database rows etc...

-- Juan Piza Ferra

## Test submission

Please, submit this test as a new repository (a fork or a new one) in any free platform you want (bitbucket, gitlab, github, ..)
