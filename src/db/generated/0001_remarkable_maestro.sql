CREATE TABLE "feeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"update_at" timestamp DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"url" text,
	"user_id" integer NOT NULL,
	CONSTRAINT "feeds_title_unique" UNIQUE("title"),
	CONSTRAINT "feeds_url_unique" UNIQUE("url")
);
