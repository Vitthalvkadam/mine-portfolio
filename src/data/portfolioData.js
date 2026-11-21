// Single source of truth for all portfolio content.
// Edit this file to update the site — components stay presentation-only.

export const profile = {
  name: "Vitthal Kadam",
  role: "Java Full Stack Developer",
  headline: "I build reliable Spring Boot backends and clean React interfaces, end to end.",
  about:
    "I'm a passionate Java Full Stack Developer focused on Java, Spring Boot, React, REST APIs and MySQL. Currently preparing for Software Development Engineer roles while mastering Data Structures & Algorithms.",
  location: "India",
  email: "vitthalvkadam@gmail.com",
  resumeUrl: "/Vitthal_Resume.pdf",
  availability: "Open to SDE and full-stack roles",
  githubUsername: "Vitthalvkadam",
  facts: [
    { label: "Based in", value: "India" },
    { label: "Focus", value: "Java, Spring Boot, React, REST APIs, MySQL" },
    { label: "Right now", value: "Preparing for SDE roles and practising DSA" },
  ],
  typingRoles: [
    "Java Full Stack Developer",
    "Spring Boot Engineer",
    "React Developer",
    "DSA Practitioner",
  ],
};

export const socials = {
  github: "https://github.com/Vitthalvkadam",
  linkedin: "https://linkedin.com/in/Vitthalvkadam",
  email: "mailto:vitthalvkadam@gmail.com",
};

export const timeline = [
  {
    year: "2024 — Present",
    title: "Java Full Stack Development",
    description:
      "Deepened expertise in Spring Boot, REST APIs, and React while shipping full-stack projects end to end.",
  },
  {
    year: "2023 — 2024",
    title: "Core Java & DSA Foundations",
    description:
      "Built a strong foundation in Java, OOP, and Data Structures & Algorithms through consistent practice.",
  },
  {
    year: "2023",
    title: "Web Development Fundamentals",
    description:
      "Learned HTML, CSS, JavaScript and version control, laying the groundwork for full-stack work.",
  },
];

export const skillCategories = [
  {
    category: "Languages",
    skills: [
      { name: "Java", icon: "java" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Spring Boot", icon: "springboot" },
      { name: "Spring MVC", icon: "spring" },
      { name: "Spring Security", icon: "springsecurity" },
      { name: "Hibernate", icon: "hibernate" },
      { name: "JPA", icon: "jpa" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Express", icon: "express" },
      { name: "REST APIs", icon: "restapi" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", icon: "react" },
      { name: "Tailwind CSS", icon: "tailwind" },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "MySQL", icon: "mysql" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Postman", icon: "postman" },
    ],
  },
];

export const projects = [
  {
    id: "studyvault",
    title: "StudyVault",
    description:
      "Smart tourism platform featuring destination recommendations, hotel booking, maps and trip planning.",
    stack: ["Spring Boot", "React", "MySQL"],
    liveUrl: null,
    githubUrl: "https://github.com/Vitthalvkadam/StudyValut",
    featured: true,
  },
  {
    id: "eventsphere",
    title: "EventSphere",
    description:
      "CampusConnect (EventSphere) is a campus event portal where organizers submit events and the HOD (and the Principal for big events) approve them before students can see them. Students browse approved events, register, pay by UPI and get QR tickets, and everyone gets in-app and email updates.",
    stack: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Mongoose"],
    liveUrl: "https://event-sphere-pearl.vercel.app",
    githubUrl: "https://github.com/Vitthalvkadam/EventSphere",
    featured: false,
  },
  {
    id: "vr-chemistry-lab",
    title: "VR Chemistry Lab",
    description:
      "A full web platform with public pages, email and Google login, a student dashboard and profile, an experiment library with a VR launch page, and an admin panel for managing users and experiments. It uses only real database data and is ready for Unity VR to plug into later.",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Java 21",
      "Spring Boot",
      "Spring Security",
      "Spring Data JPA",
      "PostgreSQL",
    ],
    liveUrl: null,
    githubUrl: "https://github.com/Vitthalvkadam/chemistry_lab",
    featured: false,
  },
];

// Shown in the "Currently building" section. Edit freely to match what you're working on.
export const currentlyBuilding = {
  projects: [
    {
      name: "VR Chemistry Lab",
      summary:
        "Web platform with student dashboard, experiment library and admin panel, structured so a Unity VR client can connect to it.",
      stack: ["React", "TypeScript", "Spring Boot", "PostgreSQL"],
      status: "Next: Unity VR integration",
      href: "https://github.com/Vitthalvkadam/chemistry_lab",
    },
  ],
  learning: ["Data Structures & Algorithms", "Spring Security", "Unity VR integration"],
};

export const certificates = [
  {
    title: "Java Full Stack Development",
    issuer: "EduSkills ACADEMY",
    date: "2026",
    image: "/certificates/javaFullStack.pdf",
  },
  {
    title: "Java Programming",
    issuer: "Infosys Springboard",
    date: "2026",
    image: "/certificates/java_SpringBoot.pdf",
  },

  {
    title: "Intro to Cloud Computing",
    issuer: "Simplilearn",
    date: "2025",
    image: "/certificates/cloudComputing.pdf",
  },
];

export const navLinks = [
  { label: "About", href: "/#about", type: "section" },
  { label: "Skills", href: "/#skills", type: "section" },
  { label: "Projects", href: "/#projects", type: "section" },
  { label: "GitHub", href: "/#github", type: "section" },
  { label: "Blog", href: "/blog", type: "page" },
  { label: "Ghost", href: "/ghost", type: "page" },
];


export const blogPosts = [
   {
    id: "git-github-developer-survival-guide",
    title: "Git & GitHub: Ctrl + Z Can't Save Every Relationship",
    excerpt:
      "Ever deleted working code, regretted everything, or wondered why developers keep saying 'push your code'? Welcome to Git and GitHub, where your mistakes finally get a backup.",
    date: "2026-11-22",
    readTime: "3 min read",
    tags: ["Git", "GitHub", "Version Control"],
    content: `
Let's imagine something.

You've been coding for three hours. Everything is finally working. You decide to make "just one small improvement."

Five minutes later, nothing works.

You try Ctrl + Z. You try again. You stare at the screen.

And suddenly you wish you had a time machine.

That's when Git becomes your best friend.

### So, what is Git?

Git is a version control system that keeps track of changes in your code.

Think of it as a save-game system for developers.

Made a mistake? Go back.
Changed something important? Track it.
Want to experiment? Create a branch.

Basically, Git remembers things that developers sometimes wish they could forget.

### And what is GitHub?

GitHub is an online platform where we can store and share our Git repositories.

Think of Git as your personal project history and GitHub as the place where you show that history to the world.

### Commands I use regularly

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git status
git push
git pull
git clone <repository-url>
\`\`\`

A few words about my favourite commands:

- git add . — Get all these changes ready.
- git commit — Save a snapshot of the changes.
- git push — Send my code to GitHub.
- git pull — Bring the latest changes to my computer.
- git status — Tell me what mess I've created.

### The real developer experience

My usual workflow looks like this:

Write code → Break something → Fix it → git add . → git commit → git push.

And sometimes:

Write code → Break everything → Google the error → Fix it → Push like nothing happened.

### Final thought

Git taught me one important lesson:

Never trust your code so much that you stop saving its history.

Because tomorrow, you might become the person asking:

"Does anyone have the last working version?"

Happy committing! 
    `,
  },
  {
    id: "getting-started-with-spring-boot",
    title: "My First Date with Spring Boot (It Was Complicated)",
    excerpt:
      "I thought building a backend was just writing a few APIs. Then Spring Boot introduced me to dependency injection, annotations, configuration files, and a few errors I still don't talk about.",
    date: "2026-11-22",
    readTime: "5 min read",
    tags: ["Spring Boot", "Java", "Backend"],
    content: `
When I first started learning Spring Boot, I had one simple thought: "How difficult can creating a REST API actually be?"

Well... famous last words.

Coming from Core Java, I was comfortable with classes, objects, inheritance, and all those OOP concepts. But Spring Boot was a different story.

Suddenly, everyone was talking about annotations like @RestController, @Service, @Autowired, and @Repository. At first, they looked like some secret developer language.

I started with the basics:

- Understanding how a Spring Boot project is structured.
- Learning what each layer actually does.
- Creating my first REST controller.
- Connecting the application with MySQL.
- Performing basic CRUD operations.

One thing that really helped me was understanding why we separate Controller, Service, and Repository instead of putting everything into one giant class.

Trust me, keeping everything in one class might look easy today, but tomorrow-you will definitely hate today-you.

I also learned about dependency injection and how Spring manages objects using its IoC container. Basically, instead of creating every object manually, Spring handles a lot of that work for us.

And yes, there were errors. Plenty of them. Sometimes the application wouldn't start, sometimes the database wouldn't connect, and sometimes one tiny annotation could ruin my entire evening.

But that's how learning works.

Spring Boot taught me that backend development isn't just about making APIs work. It's about writing code that other developers (and future me) can actually understand.

Still learning, still debugging, and hopefully getting better with every project.
    `,
  },
  {
    id: "dsa-patterns-that-saved-me",
    title: "DSA: Me vs. One Simple Array Problem",
    excerpt:
      "Ever spent two hours solving a problem that had a solution in ten minutes? Here are some DSA patterns that helped me stop fighting with every single question.",
    date: "2026-11-22",
    readTime: "7 min read",
    tags: ["DSA", "Java", "Interview Prep"],
    content: `
Let's be honest.

When I first started solving DSA problems, my strategy was pretty simple:

Read the question → Start writing loops → Get confused → Add another loop → Get more confused → Finally check the solution.

Not exactly a world-class strategy.

After solving a few problems, I started noticing something interesting. Different questions were using similar approaches.

That's when I started learning DSA patterns.

Here are five patterns that made problem-solving a little less painful.

### 1. Two Pointers

Imagine searching for two numbers in a sorted array that add up to a target.

Instead of checking every possible pair, we can use two pointers: one at the beginning and one at the end.

Move them based on the current sum.

Less unnecessary work, fewer loops, happier developer.

### 2. Sliding Window

This one is useful when dealing with subarrays or substrings.

Imagine finding the maximum sum of three consecutive elements.

Instead of calculating the sum again and again, we maintain a window and update it as it moves.

Basically, don't throw away your previous work when you can reuse it.

### 3. Prefix Sum

Need to calculate the sum of multiple ranges in an array?

Prefix sums can help.

We calculate cumulative sums once and use them to answer range-sum queries efficiently.

A little preparation now saves a lot of calculations later.

### 4. Fast and Slow Pointers

Two pointers moving at different speeds.

Sounds like a racing game, but it's actually useful for detecting cycles in linked lists.

The fast pointer moves two steps while the slow pointer moves one.

If they meet, there's a cycle.

### 5. HashMap

Whenever I see questions involving frequency counting, duplicates, or quick lookups, HashMap is one of the first things I consider.

It can save us from unnecessary nested loops.

### What I learned

The biggest mistake I made was trying to memorize solutions instead of understanding patterns.

Now, whenever I see a new problem, I first ask myself:

"Have I seen something similar before?"

I still get stuck. I still look at hints sometimes. And occasionally, I still stare at the screen wondering why the code isn't working.

But at least now I have a strategy instead of randomly writing loops.

One problem at a time!
    `,
  },
  {
    id: "building-a-full-stack-app",
    title: "React + Spring Boot: Making Frontend and Backend Talk",
    excerpt:
      "React handles what users see, Spring Boot handles what happens behind the scenes, and I somehow ended up being the person responsible for making them communicate.",
    date: "2026-11-22",
    readTime: "6 min read",
    tags: ["React", "Spring Boot", "MySQL", "Full Stack"],
    content: `
Building a frontend is fun.

Building a backend is interesting.

Connecting both of them? That's where the real story begins.

When I started exploring full-stack development with React and Spring Boot, I realized that creating two separate applications is one thing, but making them communicate properly is another.

Here's how I understood the flow.

### The frontend: React

React is responsible for the user interface.

Buttons, forms, pages, loading states, and displaying data — that's where React does its job.

For example, imagine a user filling out a registration form.

React collects the details and sends them to the backend using fetch or Axios.

### The backend: Spring Boot

Now the request reaches Spring Boot.

This is where things get interesting.

The Controller receives the HTTP request, the Service handles the business logic, and the Repository communicates with the database.

After processing everything, Spring Boot sends a response back, usually in JSON format.

### The database: MySQL

MySQL stores the actual application data.

Spring Boot uses technologies like Spring Data JPA and Hibernate to interact with the database without writing every SQL query manually.

So the complete journey looks something like this:

React Form → HTTP Request → Spring Boot Controller → Service → Repository → MySQL

And then the response travels back to React.

### Things I learned the hard way

- CORS errors are not your best friends.
- API URLs need to be configured correctly.
- Backend and frontend ports are usually different during development.
- JSON request and response formats matter.
- A working backend doesn't automatically mean the frontend will work.

I also learned that debugging full-stack applications requires understanding both sides instead of blaming whichever side I touched last.

### Final thought

The interesting part of full-stack development is not just knowing React or Spring Boot separately.

It's understanding how all the pieces work together to create one application.

And honestly, seeing data travel from a React form, reach the database, and come back onto the screen is still pretty satisfying.
    `,
  },
  {
    id: "docker-for-developers",
    title: "Docker: Because It Works on My Machine Is Not an Excuse",
    excerpt:
      "My application worked perfectly on my laptop. Then came deployment. That's when I started understanding why developers love Docker.",
    date: "2026-11-22",
    readTime: "6 min read",
    tags: ["Docker", "DevOps", "Backend"],
    content: `
"It works on my machine."

Every developer has probably said this at least once.

I definitely understand why.

Imagine building a React application with a Spring Boot backend and MySQL database. Everything works perfectly on your laptop.

You send the project to someone else.

And suddenly:

Wrong Java version.
Missing dependencies.
Different database configuration.
Application refuses to start.

Congratulations! You've discovered environment problems.

This is where Docker comes into the picture.

### So, what exactly is Docker?

Docker allows us to package an application along with its required environment and dependencies into something called a container.

Think of it like packing your entire application setup into a box.

Instead of asking another developer to manually install and configure everything, we can provide a Docker image that contains what the application needs.

### Image vs Container

This confused me initially.

Here's the simple explanation:

- Docker Image: The blueprint or template.
- Docker Container: A running instance created from that image.

Think of an image as a recipe and a container as the actual food prepared using that recipe.

### The Dockerfile

A Dockerfile contains instructions for building an image.

For example, here's a simple Dockerfile for a Java Spring Boot application:

\`\`\`dockerfile
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

A quick breakdown:

- FROM: Selects the base image.
- WORKDIR: Sets the working directory.
- COPY: Copies our application JAR.
- EXPOSE: Documents the application's port.
- ENTRYPOINT: Defines the command to start the application.

### A few Docker commands I started learning

\`\`\`bash
docker --version

docker build -t my-spring-app .

docker images

docker run -p 8080:8080 my-spring-app

docker ps

docker stop container_id
\`\`\`

These commands helped me understand the basic Docker workflow.

### What about Docker Compose?

Now imagine our application needs three things:

- React frontend
- Spring Boot backend
- MySQL database

Starting and managing everything separately can become annoying.

Docker Compose helps us define and manage multiple services using a single YAML configuration file.

One command can start the entire application environment:

\`\`\`bash
docker compose up
\`\`\`

And to stop it:

\`\`\`bash
docker compose down
\`\`\`

Pretty convenient, right?

### What I understood

Docker doesn't magically fix bad code or every deployment problem.

But it makes application environments much easier to package, reproduce, and share.

I'm still exploring Docker and learning how containers, images, volumes, networks, and Compose work together.

For now, one thing is clear:

I would rather learn Docker than explain for the tenth time why my application works perfectly on my laptop but refuses to work anywhere else.

Happy containerizing!
    `,
  },
];
