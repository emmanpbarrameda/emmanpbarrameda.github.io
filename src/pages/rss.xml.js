// src\pages\rss.xml.js
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { infos } from "../data/infos.js";

export async function GET(context) {
    const posts = (await getCollection("blog"))
        .filter((p) => (import.meta.env.PROD ? !p.data.draft : true))
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    return rss({
        title: `${infos.subname} — ${infos.blog_page_name}`,
        description: infos.blog_page_tagline,
        site: context.site,
        items: posts.map((post) => {
            const id = post.id.replace(/\.(md|mdx)$/, "");
            return {
                title: post.data.title,
                description: post.data.description,
                pubDate: post.data.pubDate,
                link: `/blog/${id}/`,
            };
        }),
    });
}