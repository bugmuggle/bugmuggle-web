DROP INDEX `users_email_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `github_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `password`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `avatar`;--> statement-breakpoint
ALTER TABLE `channels` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `members` ADD `type` text NOT NULL;