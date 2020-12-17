;(function($, window, document, undefined) {
  'use strict';

  //
  // Constants
  const PUB_BASE_URL = 'https://pub.peterkoelln.de';
  const PUB_API_PRODUCTS = '/api/meta/products/database';
  const PUB_API_LOGOS = '/api/meta/logos/database';
  const PUB_API_BATCH = '/api/meta/download/batch';
  const LOGOS_ID = 9999999;
  const CAT_ID_MAP = {
    koelln: [1, 2, 3, 4, 5, 6, 7, 8, 21],
    mazola: [9],
    mazola_at: [22],
    biskin: [12],
    livio: [10],
    palmin: [13],
    brecht: [11],
    edelweiss: [15],
    logo: [LOGOS_ID],
  };

  //
  // ROOT Nodes
  const $container = $('[data-pub="container"]');
  const $form = $('[data-pub="filter-form"]');
  const $input = $('[data-pub="filter-input"]');
  const $list = $('[data-pub="filter-list-data"]');
  const $ratio = $('input[name="productdownloadfilter"]');
  const $btnDl = $('[data-pub="btn-download"]');

  //
  // Locale Helper
  const locale = {
    data: $container.data('pubLang'),
    t: function(key) {
      return key.split('.').reduce((a, b) => {
        return a && a[b];
      }, this.data);
    },
    n: function(key) {
      return t(this.t(key));
    }
  };

  //
  // DOM Renderer
  const renderSection = node => {
    return h('div', {class: 'ProductDownload-tableGrid u-marginBottom--r4', 'data-pub-cat': node.id}, [
      h('table', {class: 'ProductDownload-table'}, [
        h('colgroup', {class: 'ProductDownload-colgroup-product'}, [
          h('col', {class: 'ProductDownload-col-title'}),
          h('col', {class: 'ProductDownload-col-weight'}),
          h('col', {class: 'ProductDownload-col-preview'})
        ]),
        h('colgroup', {span: 2, class: 'ProductDownload-colgroup-frontview'}),
        h('colgroup', {span: 2, class: 'ProductDownload-colgroup-sideview'}),
        h('thead', {class: 'ProductDownload-tableHead'}, [
          h('tr', {}, [
            h('th', {rowspan: 2, scope: 'col', class: 'ProductDownload-tableTitle'}, [t(node.name)]),
            h('th', {rowspan: 2, scope: 'col', class: 'ProductDownload-tableHeader'}, [
              h('span', {class: 'u-visuallyHidden'}, [locale.n('table.weight')])
            ]),
            h('th', {rowspan: 2, scope: 'col', class: 'ProductDownload-tableHeader u-textAlign--center'}, [locale.n('table.preview')]),
            h('th', {colspan: 2, scope: 'colgroup', class: 'ProductDownload-tableHeader'}, [locale.n('table.frontView')]),
            h('th', {colspan: 2, scope: 'colgroup', class: 'ProductDownload-tableHeader'}, [locale.n('table.sideView')])
          ]),
          h('tr', {}, [
            h('th', {scope: 'col', class: 'ProductDownload-tableSubHeader'}, [locale.n('table.72dpi')]),
            h('th', {scope: 'col', class: 'ProductDownload-tableSubHeader'}, [locale.n('table.300dpi')]),
            h('th', {scope: 'col', class: 'ProductDownload-tableSubHeader'}, [locale.n('table.72dpi')]),
            h('th', {scope: 'col', class: 'ProductDownload-tableSubHeader'}, [locale.n('table.300dpi')])
          ])
        ]),
        h('tbody', {class: 'ProductDownload-tableBody'}, node.items.map(i => renderSectionRow(i)))
      ])
    ]);
  };
  const renderSectionRow = node => {
    return h('tr', {class: 'ProductDownload-bodyTableRow', 'data-pub-prod': node.id}, [
      h('td', {class: 'ProductDownload-tableData'}, [t(node.name)]),
      h('td', {class: 'ProductDownload-tableSubData'}, [], node.sizeF),
      h('td', {class: 'ProductDownload-tablePreviewData'}, [renderPreview(node)]),
      h('td', {class: 'ProductDownload-tableData'}, [renderCheckbox(node, 'front72', locale.t('check.front72'))]),
      h('td', {class: 'ProductDownload-tableData'}, [renderCheckbox(node, 'front300', locale.t('check.front300'))]),
      h('td', {class: 'ProductDownload-tableData'}, [renderCheckbox(node, 'side72', locale.t('check.side72'))]),
      h('td', {class: 'ProductDownload-tableData'}, [renderCheckbox(node, 'side300', locale.t('check.side300'))]),
    ]);
  };
  const renderPreview = node => {
    const hasSide = !!node.images.side72;
    const hasFront = !!node.images.front72;
    const img = hasSide ? node.images.side72.path : node.images.front72.path;
    if (!hasSide && !hasFront) {
      return; // No Valid image
    }
    return h('a', {class: 'ProductDownload-previewLink js-lightbox', href: img, title: node.name}, [icon('#symbol-preview')]);
  };
  const renderCheckbox = (node, key, label) => {
    const hasImage = !!node.images[key];
    const id = 'product-' + key + '-' + node.id;
    let attrs = {class: 'ProductDownload-checkbox', type: 'checkbox', id: id, name: 'productDownloadImage[]'};
    if (!hasImage) {
      attrs.disabled = 'disabled';
    } else {
      attrs.value = node.images[key].hash;
    }
    return h('div', {class: 'ProductDownload-tableCheckbox-group'}, [
      h('input', attrs),
      h('label', {class: 'ProductDownload-checkbox-label', for: id}, [t(label)])
    ])
  };
  const renderList = node => {
    let result = [];
    $.each(node.items, (ii, i) => {
      let prefix = i.ano ? (i.ano + ' - ') : '';
      let suffix = i.size ? (' - ' + i.size) : '';
      result.push(h('option', {value: prefix + i.name + suffix, 'data-pub-id': i.id}));
    });
    return result;
  };

  //
  // DOM Helper
  const h = (tag, attr = {}, child = [], inner) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attr)) {
      node.setAttribute(k, v);
    }
    for (const c of child) {
      node.appendChild(c);
    }
    if (inner) {
      node.innerHTML = inner;
    }
    return node;
  };
  const t = text => {
    return document.createTextNode(text);
  };
  const icon = key => {
    const NS_SVG = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS_SVG, 'svg');
    const use = document.createElementNS(NS_SVG, 'use');
    svg.setAttribute('xmlns', NS_SVG);
    svg.setAttribute('class', 'u-scalingInlineSVG');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('role', 'img');
    svg.setAttribute('viewBox', '0 0 512 512');
    svg.setAttribute('preserveAspectRatio', 'xMidYMin slice');
    svg.setAttribute('style', 'padding-bottom: 100%;');
    use.setAttribute('x', 0);
    use.setAttribute('y', 0);
    use.setAttribute('aria-hidden', 'true');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', key);
    svg.appendChild(use);
    return svg;
  };

  //
  // Data Mapper
  const mapData = (categories, logos) => {
    const TYPE_WEB = 'web';
    const TYPE_EPS = 'eps';
    const hasImg = (node, pos, size) => {
      if (!node.hasOwnProperty(pos) || !node[pos].hasOwnProperty(size)) {
        return false;
      }
      return {hash: node[pos][size].hash, path: PUB_BASE_URL + node[pos][size].path}
    };
    const mapImg = (images, keyFront, keySide) => {
      return {
        front72: hasImg(images, keyFront, TYPE_WEB),
        front300: hasImg(images, keyFront, TYPE_EPS),
        side72: hasImg(images, keySide, TYPE_WEB),
        side300: hasImg(images, keySide, TYPE_EPS),
      }
    };
    const mapItem = (id, name, size, sizeUnit, ano, images) => {
      return {id, name, size: (size + ' ' + sizeUnit).trim(), sizeF: (size + '&nbsp;' + sizeUnit).trim(), ano, images};
    };
    const result = [];
    $.each(categories, (ic, c) => {
      const category = {id: c.id, name: c.name, items: []};
      $.each(c.products, (ip, p) => {
        $.each(p.variants, (iv, v) => {
          category.items.push(mapItem(v.id, p.name, v.packageSizeValue, v.packageSizeUnit, v.articleNumber, mapImg(v.images, 'front', 'side')));
        })
      });
      result.push(category);
    });
    const logosCategory = {id: LOGOS_ID, name: locale.t('section.logo'), items: []};
    $.each(logos, (il, l) => {
      logosCategory.items.push(mapItem(l.id, l.name, '', '', '', mapImg(l.variants[0].images, 'default', null)));
    });
    result.push(logosCategory);
    return result;
  };

  //
  // API Helper
  const loadProducts = marketId => {
    return $.ajax({url: `${PUB_BASE_URL}${PUB_API_PRODUCTS}?market=${marketId}`, method: 'get'});
  };
  const loadLogos = () => {
    return $.ajax({url: `${PUB_BASE_URL}${PUB_API_LOGOS}`, method: 'get'});
  };
  const fetchDownload = hashes => {
    return $.ajax({url: `${PUB_BASE_URL}${PUB_API_BATCH}`, method: 'post', data: {images: hashes}});
  };

  //
  // Filter Handler
  const resetState = () => {
    $container.find('[data-pub-cat], [data-pub-prod]').show();
  };
  const resetRadio = () => {
    $ratio.prop('checked', false);
  };

  //
  // Event Handler
  const handleChangeFilter = event => {
    const key = event.currentTarget.value;
    if (!CAT_ID_MAP.hasOwnProperty(key)) {
      return; // Abort Invalid Radio Key
    }
    const valid = CAT_ID_MAP[key];
    resetState();
    $container
      .find('[data-pub-cat]')
      .filter((ii, i) => !valid.includes(parseInt(i.dataset.pubCat, 10)))
      .hide();
  };
  const handleSubmitForm = event => {
    event.preventDefault();
    // console.log(event);
    // @TODO: Required?
  };
  const handleChangeSearch = event => {
    const input = event.currentTarget.value;
    const option = $list.children().filter((io, o) => o.value === input); // EXPENSIVE SEARCH!
    if (option.length === 0) {
      console.warn('[FILTER] No match for: ' + input);
      return; // Abort
    }
    resetState();
    resetRadio();
    const prodId = parseInt(option.data('pubId'), 10);
    const $node = $container.find('[data-pub-prod="' + prodId + '"]');
    const $parent = $node.parents('[data-pub-cat]');
    $node.siblings('[data-pub-prod]').hide();
    $parent.siblings('[data-pub-cat]').hide();
  };
  const handleClickDownload = event => {
    event.preventDefault();
    const hashes = $container.find('input[type="checkbox"]:checked').map((ii, i) => i.value).get();
    if (hashes.length === 0) {
      return; // Nothing Selected
    }
    fetchDownload(hashes).done(res => {
      location.href = `${PUB_BASE_URL}${res.path}`;
    });
  };

  //
  // INIT
  const initLightBox = () => {
    // Borrowed form /nc_provider_main/Resources/Private/Javascript/Global/jquery.lightbox.js
    $container.find('.js-lightbox').magnificPopup({
      type: 'image',
      tLoading: 'Laden...',
      tClose: 'Schliessen (Esc)',
      image: {
        titleSrc: function(item) {
          let title = item.el.attr('title') || item.el.find('img').attr('title');
          return ((title) ? title : '');
        }
      },
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1],
        tCounter: '%curr% von %total%',
        tPrev: 'Zurück',
        tNext: 'Vor'
      },
      mainClass: 'mfp-zoom',
      removalDelay: 500,
      callbacks: {
        beforeOpen: function() {
          // just a hack that adds mfp-anim class to markup
          this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
          this.st.mainClass = 'mfp-zoom';
        }
      }
    });
  };
  const init = () => {
    // Fetch and Render Data
    const req1 = loadProducts(1);
    const req2 = loadLogos();
    $.when(req1, req2).done((res1, res2) => {
      mapData(res1[0], res2[0]).forEach(section => {
        $list.append(renderList(section));          // Fill Datalist Options
        $container.append(renderSection(section));  // Render Product Tables
      });
      initLightBox();
    });

    // Bind Events
    $form.on('submit', handleSubmitForm);
    $form.on('reset', resetState);
    $ratio.on('change', handleChangeFilter);
    $input.on('change', handleChangeSearch);
    $btnDl.on('click', handleClickDownload);
  };

  //
  // Self Execute
  init();
}(jQuery, window, document));
