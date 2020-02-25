<?php
defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function()
    {

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Koelln.Pubmodule',
            'Pub',
            [
                'Pub' => 'downloads'
            ],
            // non-cacheable actions
            [

            ]
        );

    // wizards
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
        'mod {
            wizards.newContentElement.wizardItems.plugins {
                elements {
                    pub {
                        iconIdentifier = pubmodule-plugin-pub
                        title = LLL:EXT:pubmodule/Resources/Private/Language/locallang_db.xlf:tx_pubmodule_pub.name
                        description = LLL:EXT:pubmodule/Resources/Private/Language/locallang_db.xlf:tx_pubmodule_pub.description
                        tt_content_defValues {
                            CType = list
                            list_type = pubmodule_pub
                        }
                    }
                }
                show = *
            }
       }'
    );
		$iconRegistry = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Imaging\IconRegistry::class);

			$iconRegistry->registerIcon(
				'pubmodule-plugin-pub',
				\TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
				['source' => 'EXT:pubmodule/Resources/Public/Icons/user_plugin_pub.svg']
			);

    }
);
