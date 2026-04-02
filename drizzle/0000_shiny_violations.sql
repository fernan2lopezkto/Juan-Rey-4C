CREATE TABLE "email_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "keywords" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "keywords_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"chords" text DEFAULT '',
	"notes" text DEFAULT '',
	"tags" json DEFAULT '[]'::json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_keywords" (
	"user_id" integer NOT NULL,
	"keyword_id" integer NOT NULL,
	"assigned_at" timestamp DEFAULT now(),
	CONSTRAINT "user_keywords_user_id_keyword_id_pk" PRIMARY KEY("user_id","keyword_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text,
	"image" text,
	"plan" text DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_login" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "youtube_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"video_id" text NOT NULL,
	"title" text NOT NULL,
	"thumbnail" text NOT NULL,
	"channel_title" text,
	"viewed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_keywords" ADD CONSTRAINT "user_keywords_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_keywords" ADD CONSTRAINT "user_keywords_keyword_id_keywords_id_fk" FOREIGN KEY ("keyword_id") REFERENCES "public"."keywords"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youtube_history" ADD CONSTRAINT "youtube_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "name_idx" ON "keywords" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_video_user_idx" ON "youtube_history" USING btree ("user_id","video_id");