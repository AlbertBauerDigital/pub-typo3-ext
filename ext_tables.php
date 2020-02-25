<?php
defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function()
    {

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Koelln.Pubmodule',
            'Pub',
            'Produkt und Bilddatenbank'
        );

        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile('pubmodule', 'Configuration/TypoScript', 'Produkt und Bilddatenbank');

    }
);
