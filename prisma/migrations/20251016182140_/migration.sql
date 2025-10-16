-- CreateTable
CREATE TABLE `Cart` (
    `cartId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `quaproductId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,

    PRIMARY KEY (`cartId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
