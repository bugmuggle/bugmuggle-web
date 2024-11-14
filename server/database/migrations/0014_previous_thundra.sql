ALTER TABLE `org_admins` RENAME TO `root_admins`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_root_admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_root_admins`("id", "user_id") SELECT "id", "user_id" FROM `root_admins`;--> statement-breakpoint
DROP TABLE `root_admins`;--> statement-breakpoint
ALTER TABLE `__new_root_admins` RENAME TO `root_admins`;--> statement-breakpoint
PRAGMA foreign_keys=ON;