# CDK with Next.js and AWS Amplify Workshop

![Next.js Amplify Workshop](images/banner.jpg)

In this workshop we'll learn how to build a full stack cloud application with Next.js, AWS CDK, GraphQL, & [AWS Amplify](https://docs.amplify.aws/).

### Overview

We'll start from scratch, creating a new Next.js app. We'll then, step by step, use CDK to build out and configure our cloud infrastructure and then use the [Amplify JS Libraries](https://github.com/aws-amplify/amplify-js) to connect the Next.js app to the APIs we create using CDK.

The app will be a blogging app with a markdown editor. When you think of many types of applications like Instagram, Twitter, or Facebook, they consist of a list of items and often the ability to drill down into a single item view. The app we will be building will be very similar to this, displaying a list of posts with data like the title, content, and author of the post.

This workshop should take you anywhere between 6 to 8 hours to complete.

### Environment & prerequisites

Before we begin, make sure you have the following:

- Node.js v10.3.0 or later  installed
- A valid and confirmed AWS account
- You must provide your credentials and an AWS Region to use AWS CDK, if you have not already done so. If you have the AWS CLI installed, the easiest way to satisfy this requirement is to [install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) and issue the following command:

```sh
aws configure
```

We will be working from a terminal using a [Bash shell](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) to run CDK CLI commands to provision infrastructure and also to run a local version of the Next.js app and test it in a web browser.

> To view the CDK pre-requisite docs, click [here](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)

### Background needed / level

This workshop is intended for intermediate to advanced front end & back end developers wanting to learn more about full stack serverless development.

While some level of React and GraphQL is helpful, because all front end code provided is copy and paste-able, this workshop requires zero previous knowledge about React or GraphQL.

### Topics we'll be covering:

- GraphQL API with AWS AppSync
- Authentication
- Authorization
- Hosting
- Deleting the resources

## Getting Started - Creating the Next.js Application

To get started, we first need to create a new Next.js project.

```bash
$ npx create-next-app cdk-next-blog
```

Now change into the new app directory & install AWS Amplify, & AWS Amplify UI React:

```bash
$ cd cdk-next-blog
$ npm install aws-amplify @aws-amplify/ui-react react-simplemde-editor react-markdown uuid
```

## Installing the CLI & Initializing a new CDK Project

### Installing the CLI

Next, we'll install the CDK CLI:

```bash
$ npm install -g aws-cdk
```

### Initializing A New Project

```bash
$ mkdir next-cdk
$ cd next-cdk
$ cdk init --language=typescript
```

The CDK CLI has initialized a new project. 

To build the project at any time, you can run the `build` command:

```sh
$ npm run build
```

To view the resources to be deployed or changes in infrastructure at any time, you can run the CDK `diff` command:

```sh
$ cdk diff
```

## Adding an AWS AppSync GraphQL API

To add a GraphQL API, we can use the following command:

```sh
$ amplify add api

? Please select from one of the above mentioned services: GraphQL
? Provide API name: NextBlog
? Choose the default authorization type for the API: API key
? Enter a description for the API key: public
? After how many days from now the API key should expire (1-365): 365 (or your preferred expiration)
? Do you want to configure advanced settings for the GraphQL API: No
? Do you have an annotated GraphQL schema? N 
? Choose a schema template: Single object with fields
? Do you want to edit the schema now? (Y/n) Y
```

The CLI should open this GraphQL schema in your text editor.

__amplify/backend/api/NextBlog/schema.graphql__

Update the schema to the following:   

```graphql
type Post @model {
  id: ID!
  title: String!
  content: String!
}
```

After saving the schema, go back to the CLI and press enter.

### Deploying the API

To deploy the API, run the push command:

```
$ amplify push

? Are you sure you want to continue? Y

# You will be walked through the following questions for GraphQL code generation
? Do you want to generate code for your newly created GraphQL API? Y
? Choose the code generation language target: javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions: ./graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions? Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested]: 2
```

Now the API is live and you can start interacting with it!

### Testing the API

To test it out we can use the GraphiQL editor in the AppSync dashboard. To open the AppSync dashboard, run the following command:

```sh
$ amplify console api

> Choose GraphQL
```

In the AppSync dashboard, click on __Queries__ to open the GraphiQL editor. In the editor, create a new post with the following mutation:

```graphql
mutation createPost {
  createPost(input: {
    title: "My first post"
    content: "Hello world!"
  }) {
    id
    title
    content
  }
}
```

Then, query for the posts:

```graphql
query listPosts {
  listPosts {
    items {
      id
      title
      content
    }
  }
}
```

### Configuring the Next app

Now, our API is created & we can test it out in our app!

The first thing we need to do is to configure our Next.js app to be aware of our Amplify project. We can do this by referencing the auto-generated `aws-exports.js` file that was created by the CLI.

Create a new file called __configureAmplify.js__ in the root of the project and add the following code:


```js
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)
```

Next, open __pages/\_app.js__ and import the Amplify configuration below the last import:

```js
import '../configureAmplify'
```

Now, our app is ready to start using our AWS services.

### Interacting with the GraphQL API from the Next.js application - Querying for data

Now that the GraphQL API is running we can begin interacting with it. The first thing we'll do is perform a query to fetch data from our API.

To do so, we need to define the query, execute the query, store the data in our state, then list the items in our UI.

The main thing to notice in this component is the API call. Take a look at this piece of code:

```js
/* Call API.graphql, passing in the query that we'd like to execute. */
const postData = await API.graphql({ query: listPosts })
```

Open __pages/index.js__ and add the following code:

```js
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { API } from 'aws-amplify'
import { listPosts } from '../graphql/queries'

export default function Home() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetchPosts()
  }, [])
  async function fetchPosts() {
    const postData = await API.graphql({
      query: listPosts
    })
    setPosts(postData.data.listPosts.items)
  }
  return (
    <div>
      <h1>Posts</h1>
      {
        posts.map((post, index) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div style={linkStyle}>
            <h2>{post.title}</h2>
          </div>
        </Link>)
        )
      }
    </div>
  )
}

const linkStyle = {
  cursor: 'pointer',
  borderBottom: '1px solid rgba(0, 0, 0 ,.1)',
  padding: '20px 0px'
}
```

Next, start the app:

```sh
$ npm run dev
```

You should be able to view the list of posts. You will not yet be able to click on a post to navigate to the detail view, that is coming up later.

## Adding authentication

Next, let's add some authentication.

To add the authentication service, run the following command using the Amplify CLI:

```sh
$ amplify add auth

? Do you want to use default authentication and security configuration? Default configuration 
? How do you want users to be able to sign in when using your Cognito User Pool? Username
? Do you want to configure advanced settings? No, I am done. 
```

To deploy the authentication service, you can run the push command:

```sh
$ amplify push

? Are you sure you want to continue? Yes
```

Next, let's add a profile screen and login flow to the app.

To do so, create a new file called __profile.js__ in the __pages__ directory. Here, add the following code:

```js
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import { useState, useEffect } from 'react'

function Profile() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    checkUser()
  }, [])
  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser()
    setUser(user)
  }
  if (!user) return null
  return (
    <div>
      <h2>Profile</h2>
      <h3>Username: {user.username}</h3>
      <p>Email: {user.attributes.email}</p>
      <AmplifySignOut />
    </div>
  )
}

export default withAuthenticator(Profile)
```

The `withAuthenticator` Amplify UI component will scaffold out an entire authentication flow to allow users to sign up and sign in.

The `AmplifySignOut` button adds a pre-style sign out button.

Next, add some styling to the UI component and our future rendered markdown by opening __styles/globals.css__ and adding the following code:

```css
:root {
  --amplify-primary-color: #0072ff;
  --amplify-primary-tint: #0072ff;
  --amplify-primary-shade: #0072ff;
}

pre {
  background-color: #ededed;
  padding: 20px;
}

img {
  max-width: 900px;
}

a {
  color: #0070f3;
}
```

Next, open __pages/\_app.js__ to add some navigation and styling to be able to navigate to the new Profile page:

```js
import '../styles/globals.css'
import '../configureAmplify'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

function MyApp({ Component, pageProps }) {
  return (
  <div>
    <nav style={navStyle}>
      <Link href="/">
        <span style={linkStyle}>Home</span>
      </Link>
      <Link href="/create-post">
        <span style={linkStyle}>Create Post</span>
      </Link>
      <Link href="/profile">
        <span style={linkStyle}>Profile</span>
      </Link>
    </nav>
    <div style={bodyStyle}>
      <Component {...pageProps} />
    </div>
    <footer className={styles.footer}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{' '}
        <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
      </a>
    </footer>
  </div>
  )
}

const navStyle = { padding: 20, borderBottom: '1px solid #ddd' }
const bodyStyle = { minHeight: 'calc(100vh - 190px)', padding: '20px 40px' }
const linkStyle = {marginRight: 20, cursor: 'pointer'}

export default MyApp
```

Next, run the app:

```sh
$ npm run dev
```

You should now be able to sign up and view your profile.

> The link to __/create-post__ will not yet work as we have not yet created this page.

## Adding authorization

Next, update the API to enable another authorization type to enable both public and private API access.

```sh
$ amplify update api

? Please select from one of the below mentioned services: GraphQL   
? Select from the options below: Update auth settings
? Choose the default authorization type for the API: API key
? Enter a description for the API key: public
? After how many days from now the API key should expire (1-365): 365 <or your preferred expiration>
? Configure additional auth types? Y
? Choose the additional authorization types you want to configure for the API: Amazon Cognito User Pool
```

![Updating the API](images/update-api.png)

Next, let's update the GraphQL schema with the following changes:

1. A new field (`username`) to identify the author of a post.
2. An `@key` directive for enabling a new data access pattern to query posts by username

Open __amplify/backend/api/NextBlog/schema.graphql__ and update it with the following:

```graphql
type Post @model
  @key(name: "postsByUsername", fields: ["username"], queryField: "postsByUsername")
  @auth(rules: [
    { allow: owner, ownerField: "username" },
    { allow: public, operations: [read] }
  ]) {
  id: ID!
  title: String!
  content: String!
  username: String
}
```

Next, deploy the updates:

```sh
$ amplify push --y
```

Now, you will have two types of API access:

1. Private (Cognito) - to create a post, a user must be signed in. Once they have created a post, they can update and delete their own post. They can also read all posts.
2. Public (API key) - Any user, regardless if they are signed in, can query for posts or a single post.
Using this combination, you can easily query for just a single user's posts or for all posts.

To make this secondary private API call from the client, the authorization type needs to be specified in the query or mutation:

```js
const postData = await API.graphql({
  mutation: createPost,
  authMode: 'AMAZON_COGNITO_USER_POOLS',
  variables: {
    input: postInfo
  }
})
```

## Adding the Create Post form and page

Next, create a new page at __pages/create-post.js__ and add the following code:

```js
import { withAuthenticator } from '@aws-amplify/ui-react'
import { useState } from 'react'
import { API } from 'aws-amplify'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"
import { createPost } from '../graphql/mutations'

const initialState = { title: '', content: '' }

function CreatePost() {
  const [post, setPost] = useState(initialState)
  const { title, content } = post
  const router = useRouter()
  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  async function createNewPost() {
    if (!title || !content) return
    const id = uuid()
    post.id = id

    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    router.push(`/posts/${id}`)
  }
  return (
    <div style={containerStyle}>
      <h2>Create new Post</h2>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        style={inputStyle}
      /> 
      <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
      <button style={buttonStyle} onClick={createNewPost}>Create Post</button>
    </div>
  )
}

const inputStyle = { marginBottom: 10, height: 35, width: 300, padding: 8, fontSize: 16 }
const containerStyle = { padding: '0px 40px' }
const buttonStyle = { width: 300, backgroundColor: 'white', border: '1px solid', height: 35, marginBottom: 20, cursor: 'pointer' }

export default withAuthenticator(CreatePost)
```

This will render a form and a markdown editor, allowing users to create new posts.

Next, create a new folder in the __pages__ directory called __posts__ and a file called __[id].js__ within that folder. In __pages/posts/[id].js__, add the following code:

```js
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import '../../configureAmplify'
import { listPosts, getPost } from '../../graphql/queries'

export default function Post({ post }) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <h1>{post.title}</h1>
      <div style={markdownStyle}>
        <ReactMarkdown children={post.content} />
      </div>
      <p>Created by: {post.username}</p>
    </div>
  )
}

export async function getStaticPaths() {
  const postData = await API.graphql({
    query: listPosts
  })
  const paths = postData.data.listPosts.items.map(post => ({ params: { id: post.id }}))
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps ({ params }) {
  const { id } = params
  const postData = await API.graphql({
    query: getPost, variables: { id }
  })
  return {
    props: {
      post: postData.data.getPost
    }
  }
}

const markdownStyle = { padding: 20, border: '1px solid #ddd', borderRadius: 5 }
```

This page uses `getStaticPaths` to dynamically create pages at build time based on the posts coming back from the API.

We also use the `fallback` flag to enable fallback routes for dynamic SSG page generation.

`getStaticProps` is used to enable the Post data to be passed into the page as props at build time.

Finally, update __pages/index.js__ to add the author field and author styles:

```js
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { API } from 'aws-amplify'
import { listPosts } from '../graphql/queries'

export default function Home() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetchPosts()
  }, [])
  async function fetchPosts() {
    const postData = await API.graphql({
      query: listPosts
    })
    setPosts(postData.data.listPosts.items)
  }
  return (
    <div>
      <h1>Posts</h1>
      {
        posts.map((post, index) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div style={linkStyle}>
            <h2>{post.title}</h2>
            <p style={authorStyle}>Author: {post.username}</p>
          </div>
        </Link>)
        )
      }
    </div>
  )
}

const linkStyle = { cursor: 'pointer', borderBottom: '1px solid rgba(0, 0, 0 ,.1)', padding: '20px 0px' }
const authorStyle = { color: 'rgba(0, 0, 0, .55)', fontWeight: '600' }
```

### Deleting existing data

Now the app is ready to test out, but before we do let's delete the existing data in the database that does not contain an author field. To do so, follow these steps:

1. Open the Amplify Console

```sh
$ amplify console api

> Choose GraphQL
```

2. Click on __Data sources__
3. Click on the link to the database
4. Click on the __Items__ tab.
5. Select the items in the database and delete them by choosing __Delete__ from the __Actions__ button.

Next, run the app:

```sh
$ npm run dev
```

You should be able to create new posts and view them dynamically.

### Running a build

To run a build and test it out, run the following:

```sh
$ npm run build

$ npm start
```

## Adding a filtered view for signed in user's posts

In a future step, we will be enabling the ability to edit or delete the posts that were created by the signed in user. Before we enable that functionality, let's first create a page for only viewing the posts created by the signed in user.

To do so, create a new file called __my-posts.js__ in the pages directory. This page will be using the `postsByUsername` query, passing in the username of the signed in user to query for only posts created by that user.

```js
// pages/my-posts.js
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { API, Auth } from 'aws-amplify'
import { postsByUsername } from '../graphql/queries'

export default function MyPosts() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetchPosts()
  }, [])
  async function fetchPosts() {
    const { username } = await Auth.currentAuthenticatedUser()
    const postData = await API.graphql({
      query: postsByUsername, variables: { username }
    })
    setPosts(postData.data.postsByUsername.items)
  }
  return (
    <div>
      <h1>My Posts</h1>
      {
        posts.map((post, index) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div style={linkStyle}>
            <h2>{post.title}</h2>
            <p style={authorStyle}>Author: {post.username}</p>
          </div>
        </Link>)
        )
      }
    </div>
  )
}

const linkStyle = { cursor: 'pointer', borderBottom: '1px solid rgba(0, 0, 0 ,.1)', padding: '20px 0px' }
const authorStyle = { color: 'rgba(0, 0, 0, .55)', fontWeight: '600' }
```

### Updating the nav

Next, we need to update the nav to show the link to the new __my-posts__ page, but only show the link if there is a signed in user.

To do so, we'll be using a combination of the `Auth` class as well as `Hub` which allows us to listen to authentication events.

Open __pages/\_app.js__ and make the following updates:

1. Import the `useState` and `useEffect` hooks from React as well as the `Auth` and `Hub` classes from AWS Amplify:

```js
import { useState, useEffect } from 'react'
import { Auth, Hub } from 'aws-amplify'
```

2. In the `MyApp` function, create some state to hold the signed in user state:

```js
const [signedInUser, setSignedInUser] = useState(false)
```

3. In the `MyApp` function, create a function to detect and maintain user state and invoke it in a `useEffect` hook:

```js
useEffect(() => {
  authListener()
})
async function authListener() {
  Hub.listen('auth', (data) => {
    switch (data.payload.event) {
      case 'signIn':
        return setSignedInUser(true)
      case 'signOut':
        return setSignedInUser(false)
    }
  })
  try {
    await Auth.currentAuthenticatedUser()
    setSignedInUser(true)
  } catch (err) {}
}
```

4. In the navigation, add a link to the new route to show only if a user is currently signed in:

```js
{
  signedInUser && (
    <Link href="/my-posts">
      <span style={linkStyle}>My Posts</span>
    </Link>
  )
}
```

Next, test it out by restarting the dev server:

```sh
npm run dev
```

## Updating and deleting posts

Next, let's add a way for a signed in user to edit and delete their posts.

First, create a new folder named __edit-post__ in the __pages__ directory. Then, create a file named __[id].js__ in this folder.

In this file, we'll be accessing the `id` of the post from a route parameter. When the component loads, we will then use the post id from the route to fetch the post data and make it available for editing.

In this file, add the following code:

```js
// pages/edit-post/[id].js
import { useEffect, useState } from 'react'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"
import { updatePost } from '../../graphql/mutations'
import { getPost } from '../../graphql/queries'

function EditPost() {
  const [post, setPost] = useState(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    fetchPost()
    async function fetchPost() {
      if (!id) return
      const postData = await API.graphql({ query: getPost, variables: { id }})
      setPost(postData.data.getPost)
    }
  }, [id])
  if (!post) return null
  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  const { title, content } = post
  async function updateCurrentPost() {
    if (!title || !content) return
    await API.graphql({
      query: updatePost,
      variables: { input: { title, content, id } },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    console.log('post successfully updated!')
    router.push('/my-posts')
  }
  return (
    <div style={containerStyle}>
      <h2>Create new Post</h2>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        style={inputStyle}
      /> 
      <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
      <button style={buttonStyle} onClick={updateCurrentPost}>Update Post</button>
    </div>
  )
}

const inputStyle = { marginBottom: 10, height: 35, width: 300, padding: 8, fontSize: 16 }
const containerStyle = { padding: '0px 40px' }
const buttonStyle = { width: 300, backgroundColor: 'white', border: '1px solid', height: 35, marginBottom: 20, cursor: 'pointer' }

export default EditPost      
```

Next, open __pages/my-posts.js__. We'll make a few updates to this page:

1. Create a function for deleting a post
2. Add a link to edit the post by navigating to `/edit-post/:postID`
3. Add a link to view the post
4. Create a button for deleting posts

Update this file with the following code:

```js
// pages/my-posts.js
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { API, Auth } from 'aws-amplify'
import { postsByUsername } from '../graphql/queries'
import { deletePost as deletePostMutation } from '../graphql/mutations'

export default function MyPosts() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetchPosts()
  }, [])
  async function fetchPosts() {
    const { username } = await Auth.currentAuthenticatedUser()
    const postData = await API.graphql({
      query: postsByUsername, variables: { username }
    })
    setPosts(postData.data.postsByUsername.items)
  }
  async function deletePost(id) {
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    fetchPosts()
  }
  return (
    <div>
      <h1>My Posts</h1>
      {
        posts.map((post, index) => (
          <div key={index} style={itemStyle}>
            <h2>{post.title}</h2>
            <p style={authorStyle}>Author: {post.username}</p>
            <Link href={`/edit-post/${post.id}`}><a style={linkStyle}>Edit Post</a></Link>
            <Link href={`/posts/${post.id}`}><a style={linkStyle}>View Post</a></Link>
            <button
              style={buttonStyle}
              onClick={() => deletePost(post.id)}
            >Delete Post</button>
          </div>
        )
        )
      }
    </div>
  )
}

const buttonStyle = { cursor: 'pointer', backgroundColor: '#ddd', border: 'none', padding: '5px 20px' }
const linkStyle = { fontSize: 14, marginRight: 10 }
const itemStyle = { borderBottom: '1px solid rgba(0, 0, 0 ,.1)', padding: '20px 0px' }
const authorStyle = { color: 'rgba(0, 0, 0, .55)', fontWeight: '600' }
```

### Enabling Incremental Static Generation

The last thing we need to do is implement [Incremental Static Generation](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration). Since we are allowing users to update posts, we need to have a way for our site to render the newly updated posts. 

Incremental Static Regeneration allows you to update existing pages by re-rendering them in the background as traffic comes in.

To enable this, open __pages/posts/[id].js__ and update the `getStaticProps` method with the following:

```js

export async function getStaticProps ({ params }) {
  const { id } = params
  const postData = await API.graphql({
    query: getPost, variables: { id }
  })
  return {
    props: {
      post: postData.data.getPost
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1 // adds Incremental Static Generation, sets time in seconds
  }
}
```

To test it out, restart the server or run a new build:

```sh
npm run dev

# or

npm run build && npm start
```

## Deployment with Serverless Framework

To deploy to AWS, create a new file at the root of the app called __serverless.yml__. In this file, add the following configuration:

```yaml
nextamplified:
  component: "@sls-next/serverless-component@1.17.0"
```

To deploy, run the following command from your terminal:

```
npx serverless
```

## Removing Services

If at any time, or at the end of this workshop, you would like to delete a service from your project & your account, you can do this by running the `amplify remove` command:

```sh
$ amplify remove auth

$ amplify push
```

If you are unsure of what services you have enabled at any time, you can run the `amplify status` command:

```sh
$ amplify status
```

`amplify status` will give you the list of resources that are currently enabled in your app.

### Deleting the Amplify project and all services

If you'd like to delete the entire project, you can run the `delete` command:

```sh
$ amplify delete
```

## Next steps / challenge

1. Enable updating posts
2. Enable deleting posts
