ALTER TABLE competitions ADD `startedAt` text;--> statement-breakpoint
ALTER TABLE competitions ADD `endedAt` text;--> statement-breakpoint
ALTER TABLE `competitions` DROP COLUMN `isActive`;