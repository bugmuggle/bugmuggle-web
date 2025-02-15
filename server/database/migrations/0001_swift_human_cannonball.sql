CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`priority` integer,
	`description` text,
	`created_by` integer,
	`channel_id` integer,
	`order` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE no action
);
