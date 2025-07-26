import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { Header } from "@/app/dashboard/header"
import { auth } from "@/lib/auth"

import { DashboardWrapper, PocketItem, PocketTag } from "./dashboard-wrapper"

export const pocketTags: PocketTag[] = [
  { id: "1", name: "TypeScript" },
  { id: "2", name: "WebDev" },
  { id: "3", name: "Productivity" },
  { id: "4", name: "AI" },
  { id: "5", name: "Tutorial" },
];

export const pocketItems: PocketItem[] = [
  {
    id: "item-1",
    name: "Understanding TypeScript Generics",
    url: "https://example.com/typescript-generics",
    type: "article",
    description: "A deep dive into generics in TypeScript.",
    completed: false,
    tags: [pocketTags[0], pocketTags[4]],
  },
  {
    id: "item-2",
    name: "React Hooks in Depth",
    url: "https://example.com/react-hooks",
    type: "video",
    description: "Comprehensive guide to React Hooks.",
    completed: true,
    tags: [pocketTags[1], pocketTags[4]],
  },
  {
    id: "item-3",
    name: "Boosting Productivity with Pomodoro",
    url: "https://example.com/pomodoro",
    type: "article",
    description: "How to use the Pomodoro technique effectively.",
    completed: false,
    tags: [pocketTags[2]],
  },
  {
    id: "item-4",
    name: "AI in Everyday Life",
    url: "https://example.com/ai-everyday",
    type: "video",
    description: "Exploring AI applications in daily routines.",
    completed: false,
    tags: [pocketTags[3]],
  },
  {
    id: "item-5",
    name: "TypeScript vs JavaScript",
    url: "https://example.com/ts-vs-js",
    type: "article",
    description: "Comparing TypeScript and JavaScript for web development.",
    completed: true,
    tags: [pocketTags[0], pocketTags[1]],
  },
  {
    id: "item-6",
    name: "Building REST APIs with Node.js",
    url: "https://example.com/node-rest-api",
    type: "video",
    description: "Step-by-step guide to building REST APIs.",
    completed: false,
    tags: [pocketTags[1], pocketTags[4]],
  },
  {
    id: "item-7",
    name: "Mastering Async/Await in JavaScript",
    url: "https://example.com/async-await",
    type: "article",
    description: "Learn how to handle asynchronous code.",
    completed: false,
    tags: [pocketTags[1]],
  },
  {
    id: "item-8",
    name: "Getting Started with Machine Learning",
    url: "https://example.com/ml-intro",
    type: "video",
    description: "Beginner's guide to machine learning concepts.",
    completed: true,
    tags: [pocketTags[3], pocketTags[4]],
  },
  {
    id: "item-9",
    name: "Effective Remote Work Strategies",
    url: "https://example.com/remote-work",
    type: "article",
    description: "Tips for staying productive while working remotely.",
    completed: false,
    tags: [pocketTags[2]],
  },
  {
    id: "item-10",
    name: "TypeScript Utility Types Explained",
    url: "https://example.com/ts-utility-types",
    type: "article",
    description: "A guide to TypeScript's built-in utility types.",
    completed: true,
    tags: [pocketTags[0]],
  },
  {
    id: "item-11",
    name: "CSS Grid Layout Crash Course",
    url: "https://example.com/css-grid",
    type: "video",
    description: "Learn CSS Grid for modern web layouts.",
    completed: false,
    tags: [pocketTags[1], pocketTags[4]],
  },
  {
    id: "item-12",
    name: "How to Use Git Effectively",
    url: "https://example.com/git-tips",
    type: "article",
    description: "Best practices for using Git in projects.",
    completed: false,
    tags: [pocketTags[1], pocketTags[2]],
  },
  {
    id: "item-13",
    name: "Introduction to Neural Networks",
    url: "https://example.com/neural-networks",
    type: "video",
    description: "Basics of neural networks and deep learning.",
    completed: false,
    tags: [pocketTags[3]],
  },
  {
    id: "item-14",
    name: "Writing Clean Code",
    url: "https://example.com/clean-code",
    type: "article",
    description: "Principles for writing maintainable code.",
    completed: true,
    tags: [pocketTags[1], pocketTags[2]],
  },
  {
    id: "item-15",
    name: "TypeScript Advanced Types",
    url: "https://example.com/ts-advanced-types",
    type: "article",
    description: "Exploring advanced types in TypeScript.",
    completed: false,
    tags: [pocketTags[0]],
  },
  {
    id: "item-16",
    name: "Building a Personal Knowledge Base",
    url: "https://example.com/knowledge-base",
    type: "video",
    description: "Organize your learning with a personal knowledge base.",
    completed: false,
    tags: [pocketTags[2], pocketTags[4]],
  },
  {
    id: "item-17",
    name: "Deploying Apps with Docker",
    url: "https://example.com/docker-deploy",
    type: "article",
    description: "A guide to deploying applications using Docker.",
    completed: true,
    tags: [pocketTags[1]],
  },
  {
    id: "item-18",
    name: "AI Ethics and Society",
    url: "https://example.com/ai-ethics",
    type: "video",
    description: "Discussion on the ethical implications of AI.",
    completed: false,
    tags: [pocketTags[3]],
  },
  {
    id: "item-19",
    name: "TypeScript for React Developers",
    url: "https://example.com/ts-react",
    type: "article",
    description: "How to use TypeScript in React projects.",
    completed: false,
    tags: [pocketTags[0], pocketTags[1]],
  },
  {
    id: "item-20",
    name: "Time Management for Developers",
    url: "https://example.com/time-management",
    type: "video",
    description: "Improve your time management skills.",
    completed: true,
    tags: [pocketTags[2]],
  },
];

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userName = session.user.name

  return (
    <div className="h-dv relative">
      <Header />
      <DashboardWrapper 
        pocketItems={pocketItems}
        pocketTags={pocketTags}
      />
    </div>
  )
}