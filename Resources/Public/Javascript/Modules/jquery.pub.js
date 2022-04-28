function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

;

(function ($, window, document, undefined) {
  'use strict';

  var PUB_BASE_URL = 'https://pub.peterkoelln.de';
  var PUB_API_PRODUCTS = '/api/meta/products/database';
  var PUB_API_LOGOS = '/api/meta/logos/database';
  var PUB_API_BATCH = '/api/meta/download/batch';
  var LOGOS_ID = 9999999;
  var CAT_ID_MAP = {
    koelln: [1, 2, 3, 4, 5, 6, 7, 8, 21, 23],
    mazola: [9],
    mazola_at: [22],
    biskin: [12],
    livio: [10],
    palmin: [13],
    brecht: [11],
    edelweiss: [15],
    heimatoel: [24],
    logo: [LOGOS_ID]
  };
  var $container = $('[data-pub="container"]');
  var $form = $('[data-pub="filter-form"]');
  var $input = $('[data-pub="filter-input"]');
  var $list = $('[data-pub="filter-list-data"]');
  var $ratio = $('input[name="productdownloadfilter"]');
  var $btnDl = $('[data-pub="btn-download"]');
  var locale = {
    data: $container.data('pubLang'),
    t: function t(key) {
      return key.split('.').reduce(function (a, b) {
        return a && a[b];
      }, this.data);
    },
    n: function n(key) {
      return t(this.t(key));
    }
  };

  var renderSection = function renderSection(node) {
    return h('div', {
      class: 'ProductDownload-tableGrid u-marginBottom--r4',
      'data-pub-cat': node.id
    }, [h('table', {
      class: 'ProductDownload-table'
    }, [h('colgroup', {
      class: 'ProductDownload-colgroup-product'
    }, [h('col', {
      class: 'ProductDownload-col-title'
    }), h('col', {
      class: 'ProductDownload-col-weight'
    }), h('col', {
      class: 'ProductDownload-col-preview'
    })]), h('colgroup', {
      span: 2,
      class: 'ProductDownload-colgroup-frontview'
    }), h('colgroup', {
      span: 2,
      class: 'ProductDownload-colgroup-sideview'
    }), h('thead', {
      class: 'ProductDownload-tableHead'
    }, [h('tr', {}, [h('th', {
      rowspan: 2,
      scope: 'col',
      class: 'ProductDownload-tableTitle'
    }, [t(node.name)]), h('th', {
      rowspan: 2,
      scope: 'col',
      class: 'ProductDownload-tableHeader'
    }, [h('span', {
      class: 'u-visuallyHidden'
    }, [locale.n('table.weight')])]), h('th', {
      rowspan: 2,
      scope: 'col',
      class: 'ProductDownload-tableHeader u-textAlign--center'
    }, [locale.n('table.preview')]), h('th', {
      colspan: 2,
      scope: 'colgroup',
      class: 'ProductDownload-tableHeader'
    }, [locale.n('table.frontView')]), h('th', {
      colspan: 2,
      scope: 'colgroup',
      class: 'ProductDownload-tableHeader'
    }, [locale.n('table.sideView')])]), h('tr', {}, [h('th', {
      scope: 'col',
      class: 'ProductDownload-tableSubHeader'
    }, [locale.n('table.72dpi')]), h('th', {
      scope: 'col',
      class: 'ProductDownload-tableSubHeader'
    }, [locale.n('table.300dpi')]), h('th', {
      scope: 'col',
      class: 'ProductDownload-tableSubHeader'
    }, [locale.n('table.72dpi')]), h('th', {
      scope: 'col',
      class: 'ProductDownload-tableSubHeader'
    }, [locale.n('table.300dpi')])])]), h('tbody', {
      class: 'ProductDownload-tableBody'
    }, node.items.map(function (i) {
      return renderSectionRow(i);
    }))])]);
  };

  var renderSectionRow = function renderSectionRow(node) {
    return h('tr', {
      class: 'ProductDownload-bodyTableRow',
      'data-pub-prod': node.id
    }, [h('td', {
      class: 'ProductDownload-tableData'
    }, [t(node.name)]), h('td', {
      class: 'ProductDownload-tableSubData'
    }, [], node.sizeF), h('td', {
      class: 'ProductDownload-tablePreviewData'
    }, [renderPreview(node)]), h('td', {
      class: 'ProductDownload-tableData'
    }, [renderCheckbox(node, 'front72', locale.t('check.front72'))]), h('td', {
      class: 'ProductDownload-tableData'
    }, [renderCheckbox(node, 'front300', locale.t('check.front300'))]), h('td', {
      class: 'ProductDownload-tableData'
    }, [renderCheckbox(node, 'side72', locale.t('check.side72'))]), h('td', {
      class: 'ProductDownload-tableData'
    }, [renderCheckbox(node, 'side300', locale.t('check.side300'))])]);
  };

  var renderPreview = function renderPreview(node) {
    var hasSide = !!node.images.side72;
    var hasFront = !!node.images.front72;
    var img = hasSide ? node.images.side72.path : node.images.front72.path;

    if (!hasSide && !hasFront) {
      return h('span');
    }

    return h('a', {
      class: 'ProductDownload-previewLink js-lightbox',
      href: img,
      title: node.name
    }, [icon('#symbol-preview')]);
  };

  var renderCheckbox = function renderCheckbox(node, key, label) {
    var hasImage = !!node.images[key];
    var id = 'product-' + key + '-' + node.id;
    var attrs = {
      class: 'ProductDownload-checkbox',
      type: 'checkbox',
      id: id,
      name: 'productDownloadImage[]'
    };

    if (!hasImage) {
      attrs.disabled = 'disabled';
    } else {
      attrs.value = node.images[key].hash;
    }

    return h('div', {
      class: 'ProductDownload-tableCheckbox-group'
    }, [h('input', attrs), h('label', {
      class: 'ProductDownload-checkbox-label',
      for: id
    }, [t(label)])]);
  };

  var renderList = function renderList(node) {
    var result = [];
    $.each(node.items, function (ii, i) {
      var prefix = i.ano ? i.ano + ' - ' : '';
      var suffix = i.size ? ' - ' + i.size : '';
      result.push(h('option', {
        value: prefix + i.name + suffix,
        'data-pub-id': i.id
      }));
    });
    return result;
  };

  var h = function h(tag) {
    var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var child = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var inner = arguments.length > 3 ? arguments[3] : undefined;
    var node = document.createElement(tag);

    for (var _i = 0, _Object$entries = Object.entries(attr); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        k = _Object$entries$_i[0],
        v = _Object$entries$_i[1];

      node.setAttribute(k, v);
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = child[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var c = _step.value;
        node.appendChild(c);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (inner) {
      node.innerHTML = inner;
    }

    return node;
  };

  var t = function t(text) {
    return document.createTextNode(text);
  };

  var icon = function icon(key) {
    var NS_SVG = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS_SVG, 'svg');
    var use = document.createElementNS(NS_SVG, 'use');
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

  var mapData = function mapData(categories, logos) {
    var TYPE_WEB = 'web';
    var TYPE_EPS = 'eps';

    var hasImg = function hasImg(node, pos, size) {
      if (!node.hasOwnProperty(pos) || !node[pos].hasOwnProperty(size)) {
        return false;
      }

      return {
        hash: node[pos][size].hash,
        path: PUB_BASE_URL + node[pos][size].path
      };
    };

    var mapImg = function mapImg(images, keyFront, keySide) {
      return {
        front72: hasImg(images, keyFront, TYPE_WEB),
        front300: hasImg(images, keyFront, TYPE_EPS),
        side72: hasImg(images, keySide, TYPE_WEB),
        side300: hasImg(images, keySide, TYPE_EPS)
      };
    };

    var mapItem = function mapItem(id, name, size, sizeUnit, ano, images) {
      return {
        id: id,
        name: name,
        size: (size + ' ' + sizeUnit).trim(),
        sizeF: (size + '&nbsp;' + sizeUnit).trim(),
        ano: ano,
        images: images
      };
    };

    var result = [];
    $.each(categories, function (ic, c) {
      var category = {
        id: c.id,
        name: c.name,
        items: []
      };
      $.each(c.products, function (ip, p) {
        $.each(p.variants, function (iv, v) {
          category.items.push(mapItem(v.id, p.name, v.packageSizeValue, v.packageSizeUnit, v.articleNumber, mapImg(v.images, 'front', 'side')));
        });
      });
      result.push(category);
    });
    var logosCategory = {
      id: LOGOS_ID,
      name: locale.t('section.logo'),
      items: []
    };
    $.each(logos, function (il, l) {
      logosCategory.items.push(mapItem(l.id, l.name, '', '', '', mapImg(l.variants[0].images, 'default', null)));
    });
    result.push(logosCategory);
    return result;
  };

  var loadProducts = function loadProducts(marketId) {
    return $.ajax({
      url: "".concat(PUB_BASE_URL).concat(PUB_API_PRODUCTS, "?market=").concat(marketId),
      method: 'get'
    });
  };

  var loadLogos = function loadLogos() {
    return $.ajax({
      url: "".concat(PUB_BASE_URL).concat(PUB_API_LOGOS),
      method: 'get'
    });
  };

  var fetchDownload = function fetchDownload(hashes) {
    return $.ajax({
      url: "".concat(PUB_BASE_URL).concat(PUB_API_BATCH),
      method: 'post',
      data: {
        images: hashes
      }
    });
  };

  var resetState = function resetState() {
    $container.find('[data-pub-cat], [data-pub-prod]').show();
  };

  var resetRadio = function resetRadio() {
    $ratio.prop('checked', false);
  };

  var handleChangeFilter = function handleChangeFilter(event) {
    var key = event.currentTarget.value;

    if (!CAT_ID_MAP.hasOwnProperty(key)) {
      return;
    }

    var valid = CAT_ID_MAP[key];
    resetState();
    $container.find('[data-pub-cat]').filter(function (ii, i) {
      return !valid.includes(parseInt(i.dataset.pubCat, 10));
    }).hide();
  };

  var handleSubmitForm = function handleSubmitForm(event) {
    event.preventDefault();
  };

  var handleChangeSearch = function handleChangeSearch(event) {
    var input = event.currentTarget.value;
    var option = $list.children().filter(function (io, o) {
      return o.value === input;
    });

    if (option.length === 0) {
      console.warn('[FILTER] No match for: ' + input);
      return;
    }

    resetState();
    resetRadio();
    var prodId = parseInt(option.data('pubId'), 10);
    var $node = $container.find('[data-pub-prod="' + prodId + '"]');
    var $parent = $node.parents('[data-pub-cat]');
    $node.siblings('[data-pub-prod]').hide();
    $parent.siblings('[data-pub-cat]').hide();
  };

  var handleClickDownload = function handleClickDownload(event) {
    event.preventDefault();
    var hashes = $container.find('input[type="checkbox"]:checked').map(function (ii, i) {
      return i.value;
    }).get();

    if (hashes.length === 0) {
      return;
    }

    fetchDownload(hashes).done(function (res) {
      location.href = "".concat(PUB_BASE_URL).concat(res.path);
    });
  };

  var initLightBox = function initLightBox() {
    $container.find('.js-lightbox').magnificPopup({
      type: 'image',
      tLoading: 'Laden...',
      tClose: 'Schliessen (Esc)',
      image: {
        titleSrc: function titleSrc(item) {
          var title = item.el.attr('title') || item.el.find('img').attr('title');
          return title ? title : '';
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
        beforeOpen: function beforeOpen() {
          this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
          this.st.mainClass = 'mfp-zoom';
        }
      }
    });
  };

  var init = function init() {
    var req1 = loadProducts(1);
    var req2 = loadLogos();
    $.when(req1, req2).done(function (res1, res2) {
      mapData(res1[0], res2[0]).forEach(function (section) {
        $list.append(renderList(section));
        $container.append(renderSection(section));
      });
      initLightBox();
    });
    $form.on('submit', handleSubmitForm);
    $form.on('reset', resetState);
    $ratio.on('change', handleChangeFilter);
    $input.on('change', handleChangeSearch);
    $btnDl.on('click', handleClickDownload);
  };

  init();
})(jQuery, window, document);
