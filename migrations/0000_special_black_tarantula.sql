CREATE TABLE `competitions` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`isActive` integer NOT NULL,
	`verificationCode` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`competitionId` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` integer PRIMARY KEY NOT NULL,
	`teamId` integer NOT NULL,
	`competitionId` integer NOT NULL,
	`score` integer NOT NULL,
	`submittedAt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `competitions_verificationCode_unique` ON `competitions` (`verificationCode`);--> statement-breakpoint
CREATE UNIQUE INDEX `verificationCodeIdx` ON `competitions` (`verificationCode`);