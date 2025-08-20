-- AlterTable
ALTER TABLE `departmentpostcomment` ADD COLUMN `media` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `postcomment` ADD COLUMN `media` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `PostMedia` (
    `id` VARCHAR(191) NOT NULL,
    `mediaUrl` VARCHAR(191) NOT NULL,
    `mediaForId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DepartmentPostMedia` (
    `id` VARCHAR(191) NOT NULL,
    `mediaUrl` VARCHAR(191) NOT NULL,
    `mediaForId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PostMedia` ADD CONSTRAINT `PostMedia_mediaForId_fkey` FOREIGN KEY (`mediaForId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepartmentPostMedia` ADD CONSTRAINT `DepartmentPostMedia_mediaForId_fkey` FOREIGN KEY (`mediaForId`) REFERENCES `DepartmentPost`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
