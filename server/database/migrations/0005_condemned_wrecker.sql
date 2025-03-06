ALTER TABLE `task_attachments` ADD `blob_key` text NOT NULL;--> statement-breakpoint
ALTER TABLE `task_attachments` DROP COLUMN `file_path`;