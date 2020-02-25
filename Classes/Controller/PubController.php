<?php

namespace Koelln\Pubmodule\Controller;

use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Extbase\Utility\LocalizationUtility as LocaleUtil;

/***
 *
 * This file is part of the "Produkt und Bilddatenbank" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 *  (c) 2020
 *
 ***/

/**
 * ProductController
 */
class PubController extends ActionController
{
    /**
     * action list
     *
     * @return void
     */
    public function downloadsAction()
    {
        $language = [
            'table'   => [
                'weight'    => LocaleUtil::translate('tableHeader.weight', 'pubmodule'),
                'preview'   => LocaleUtil::translate('tableHeader.preview', 'pubmodule'),
                'frontView' => LocaleUtil::translate('tableHeader.frontview', 'pubmodule'),
                'sideView'  => LocaleUtil::translate('tableHeader.sideview', 'pubmodule'),
                '72dpi'     => LocaleUtil::translate('tableHeader.72dpi', 'pubmodule'),
                '300dpi'    => LocaleUtil::translate('tableHeader.300dpi', 'pubmodule')
            ],
            'check'   => [
                'front72'  => LocaleUtil::translate('check.front72', 'pubmodule'),
                'front300' => LocaleUtil::translate('check.front300', 'pubmodule'),
                'side72'   => LocaleUtil::translate('check.side72', 'pubmodule'),
                'side300'  => LocaleUtil::translate('check.side300', 'pubmodule'),
            ],
            'section' => [
                'logo' => LocaleUtil::translate('section.logos', 'pubmodule')
            ]
        ];

        $this->view->assignMultiple([
            'language' => json_encode($language),
            'settings' => $this->settings
        ]);
    }
}
