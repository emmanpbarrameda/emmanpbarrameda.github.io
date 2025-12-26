---
title: "Hello World"
description: "My first post using Astro Content Collections."
pubDate: 2025-12-24
tags: ["astro", "blog", "filamentphp", "laravel"]
draft: true
---

# Hello World 👋

This is my first blog post — and I’m starting it with something I genuinely use a lot: **FilamentPHP**.

## Why I love FilamentPHP

If you’re building dashboards, admin panels, or internal tools on top of **Laravel**, Filament is one of the fastest ways to ship something that still feels clean and professional.

Here’s what makes it click for me:

- **Productive by default** — resources, forms, tables, actions, filters… the essentials are already there.
- **Beautiful UI** — modern design out of the box without spending a week styling buttons.
- **Customizable** — when the defaults aren’t enough, it’s still Laravel under the hood (so you can extend anything).
- **Great developer experience** — the API feels intentional. You can keep your code organized and readable even as the project grows.

## The kind of systems Filament is perfect for

Filament shines when you’re building things like:

- Inventory Management Systems
- IT Asset Disposition (ITAD) workflows
- CRM dashboards
- Order fulfillment panels
- Internal tooling for teams (ops, accounting, support, etc.)

Basically, anywhere you need structured data input + visibility + speed.

## Forms and Tables are the “superpowers”

The two areas where Filament really becomes a cheat code:

### Forms

You can build complex forms with:

- conditional fields
- repeaters
- wizards/steps
- validation rules
- custom components

### Tables

And tables give you:

- filters, sorting, search
- actions (view/edit/custom)
- bulk actions
- relation managers
- export/import workflows

That combination is _exactly_ what most internal tools need.

## Filament + TALL Stack feels like home

Since Filament is built around **Livewire**, it pairs nicely with the TALL stack:

- **Tailwind CSS** for styling
- **Alpine.js** for small interactions
- **Laravel** backend
- **Livewire** for reactive UI

You get a snappy admin experience without building an entire SPA.

## What I’m planning next

For this blog, I’ll likely write about:

- how I structure Filament resources for large projects
- making workflows (stages, approvals, locks, audit logs)
- performance tips (queues, caching, exports)
- UI polish (sticky modals, reusable components, themes)

If you’re also building something with Filament, let’s connect — I’m always happy to talk about real-world patterns and clean setups.

## Installation

```bash
composer require emmanpbarrameda/filament-take-picture-field:^1.2.1
```

## Sample Image

![Cover](/blog-images/cert-best-in-ict.webp)

<p class="img-caption"><em>Figure: My workflow diagrams.</em></p>

## Sample Video

<figure class="blog-media">
  <video controls playsinline preload="metadata">
    <source src="/blog-videos/115474571-03c75800-a23e-11eb-8096-8973aad5fa9f.mp4" type="video/mp4" />
  </video>
  <figcaption>Figure: Demo of the workflow.</figcaption>
</figure>

## Sample YT Video

<figure class="blog-media">
  <div class="blog-video-embed">
    <iframe
      src="https://www.youtube.com/embed/ZOBIPb-6PTc"
      title="Walkthrough video"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
  <figcaption>Figure: Walkthrough video.</figcaption>
</figure>