<?php

$GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist']['pubmodule_pub'] = 'pi_flexform';
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue(
// plugin signature: <extension key without underscores> '_' <plugin name in lowercase>
        'pubmodule_pub',
        // Flexform configuration schema file
        'FILE:EXT:pubmodule/Configuration/FlexForms/FlexformPub.xml'
        );