/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module mdast-util-to-hast
 * @fileoverview Test suite for `mdast-util-to-hast`.
 */

'use strict';

/* eslint-env node */

/* Dependencies. */
var test = require('tape');
var u = require('unist-builder');
var to = require('./index.js');

/* Tests. */
test('toHAST()', function (t) {
  t.throws(
    function () {
      to(u('bar', [true]));
    },
    /Expected node, got `true`/,
    'should throw on non-nodes'
  );

  t.test('Nodes', function (st) {
    st.deepEqual(
      to(u('text', 'alpha')),
      u('text', 'alpha'),
      'should map `text`s'
    );

    st.deepEqual(
      to(u('root', [])),
      u('root', []),
      'should map `root`s'
    );

    st.deepEqual(
      to(u('paragraph', [u('text', 'bravo')])),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'bravo')]),
      'should transform `paragraph` to a `p` element'
    );

    st.deepEqual(
      to(u('blockquote', [
        u('paragraph', [u('text', 'charlie')]),
        u('paragraph', [u('text', 'delta')])
      ])),
      u('element', {tagName: 'blockquote', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'p', properties: {}}, [u('text', 'charlie')]),
        u('text', '\n'),
        u('element', {tagName: 'p', properties: {}}, [u('text', 'delta')]),
        u('text', '\n')
      ]),
      'should transform `blockquote` to a `blockquote` element'
    );

    st.deepEqual(
      to(u('heading', {depth: 4}, [u('text', 'echo')])),
      u('element', {tagName: 'h4', properties: {}}, [u('text', 'echo')]),
      'should transform `heading` to a `h[1-6]` element'
    );

    st.deepEqual(
      to(u('code', 'foxtrot()\ngolf.hotel()')),
      u('element', {tagName: 'pre', properties: {}}, [
        u('element', {tagName: 'code', properties: {}}, [
          u('text', 'foxtrot()\ngolf.hotel()\n')
        ])
      ]),
      'should transform `code` to a `pre` element (#1)'
    );

    st.deepEqual(
      to(u('code', '')),
      u('element', {tagName: 'pre', properties: {}}, [
        u('element', {tagName: 'code', properties: {}}, [
          u('text', '')
        ])
      ]),
      'should transform `code` to a `pre` element (#2)'
    );

    st.deepEqual(
      to(u('code', {lang: 'js'}, 'india()')),
      u('element', {tagName: 'pre', properties: {}}, [
        u('element', {tagName: 'code', properties: {className: ['language-js']}}, [
          u('text', 'india()\n')
        ])
      ]),
      'should transform `code` to a `pre` element with language class'
    );

    st.deepEqual(
      to(u('inlineCode', 'juliett()')),
      u('element', {tagName: 'code', properties: {}}, [
        u('text', 'juliett()')
      ]),
      'should transform `inlineCode` to a `code` element'
    );

    st.equal(
      to(u('yaml', 'kilo: "lima"')),
      null,
      'should ignore `yaml`'
    );

    st.equal(
      to(u('html', '<mike></mike>')),
      null,
      'should ignore `html`'
    );

    st.deepEqual(
      to(u('html', '<mike></mike>'), {allowDangerousHTML: true}),
      u('raw', '<mike></mike>'),
      'should transform `html` to `raw` if `allowDangerousHTML` is given'
    );

    st.deepEqual(
      to(u('listItem', [
        u('paragraph', [u('text', 'november')])
      ])),
      u('element', {tagName: 'li', properties: {}}, [
        u('text', 'november')
      ]),
      'should transform tight `listItem`s to a `li` element'
    );

    st.deepEqual(
      to(u('listItem', [
        u('paragraph', [u('text', 'oscar')]),
        u('paragraph', [u('text', 'papa')])
      ])),
      u('element', {tagName: 'li', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'p', properties: {}}, [
          u('text', 'oscar')
        ]),
        u('text', '\n'),
        u('element', {tagName: 'p', properties: {}}, [
          u('text', 'papa')
        ]),
        u('text', '\n')
      ]),
      'should transform loose `listItem`s to a `li` element'
    );

    st.deepEqual(
      to(u('listItem', {checked: true}, [
        u('paragraph', [u('text', 'québec')])
      ])),
      u('element', {tagName: 'li', properties: {}}, [
        u('element', {
          tagName: 'input',
          properties: {
            type: 'checkbox',
            checked: true,
            disabled: true
          }
        }, []),
        u('text', ' '),
        u('text', 'québec')
      ]),
      'should support checkboxes in tight `listItem`s'
    );

    st.deepEqual(
      to(u('listItem', {checked: false}, [
        u('paragraph', [u('text', 'romeo')]),
        u('paragraph', [u('text', 'sierra')])
      ])),
      u('element', {tagName: 'li', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'p', properties: {}}, [
          u('element', {
            tagName: 'input',
            properties: {
              type: 'checkbox',
              checked: false,
              disabled: true
            }
          }, []),
          u('text', ' '),
          u('text', 'romeo')
        ]),
        u('text', '\n'),
        u('element', {tagName: 'p', properties: {}}, [
          u('text', 'sierra')
        ]),
        u('text', '\n')
      ]),
      'should support checkboxes in loose `listItem`s'
    );

    st.deepEqual(
      to(u('listItem', {checked: true}, [
        u('html', '<!--tango-->')
      ])),
      u('element', {tagName: 'li', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'p', properties: {}}, [
          u('element', {
            tagName: 'input',
            properties: {
              type: 'checkbox',
              checked: true,
              disabled: true
            }
          }, [])
        ]),
        u('text', '\n')
      ]),
      'should support checkboxes in `listItem`s without paragraph'
    );

    st.deepEqual(
      to(u('list', {ordered: true}, [
        u('listItem', [u('paragraph', [u('text', 'uniform')])])
      ])),
      u('element', {tagName: 'ol', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'li', properties: {}}, [
          u('text', 'uniform')
        ]),
        u('text', '\n')
      ]),
      'should transform ordered lists to `ol`'
    );

    st.deepEqual(
      to(u('list', {ordered: false}, [
        u('listItem', [u('paragraph', [u('text', 'whiskey')])])
      ])),
      u('element', {tagName: 'ul', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'li', properties: {}}, [
          u('text', 'whiskey')
        ]),
        u('text', '\n')
      ]),
      'should transform unordered lists to `ul`'
    );

    st.deepEqual(
      to(u('list', {ordered: true, start: 3}, [
        u('listItem', [u('paragraph', [u('text', 'x-ray')])])
      ])),
      u('element', {tagName: 'ol', properties: {start: 3}}, [
        u('text', '\n'),
        u('element', {tagName: 'li', properties: {}}, [
          u('text', 'x-ray')
        ]),
        u('text', '\n')
      ]),
      'should support `start` in ordered lists'
    );

    st.deepEqual(
      to(u('table', {align: ['left', 'right']}, [
        u('tableRow', [
          u('tableCell', [u('text', 'yankee')]),
          u('tableCell', [u('text', 'zulu')])
        ]),
        u('tableRow', [
          u('tableCell', [u('text', 'alpha')])
        ])
      ])),
      u('element', {tagName: 'table', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'thead', properties: {}}, [
          u('text', '\n'),
          u('element', {tagName: 'tr', properties: {}}, [
            u('text', '\n'),
            u('element', {tagName: 'th', properties: {align: 'left'}}, [
              u('text', 'yankee')
            ]),
            u('text', '\n'),
            u('element', {tagName: 'th', properties: {align: 'right'}}, [
              u('text', 'zulu')
            ]),
            u('text', '\n')
          ]),
          u('text', '\n')
        ]),
        u('text', '\n'),
        u('element', {tagName: 'tbody', properties: {}}, [
          u('text', '\n'),
          u('element', {tagName: 'tr', properties: {}}, [
            u('text', '\n'),
            u('element', {tagName: 'td', properties: {align: 'left'}}, [
              u('text', 'alpha')
            ]),
            u('text', '\n'),
            u('element', {tagName: 'td', properties: {align: 'right'}}, []),
            u('text', '\n')
          ]),
          u('text', '\n')
        ]),
        u('text', '\n')
      ]),
      'should transform `table`'
    );

    st.deepEqual(
      to(u('thematicBreak')),
      u('element', {tagName: 'hr', properties: {}}, []),
      'should transform `thematicBreak` to `hr`'
    );

    st.deepEqual(
      to(u('paragraph', [
        u('text', 'bravo'),
        u('break'),
        u('text', 'charlie')
      ])),
      u('element', {tagName: 'p', properties: {}}, [
        u('text', 'bravo'),
        u('element', {tagName: 'br', properties: {}}, []),
        u('text', '\n'),
        u('text', 'charlie')
      ]),
      'should transform `break` to `br`'
    );

    st.deepEqual(
      to(u('paragraph', [
        u('text', 'alpha'),
        u('break'),
        u('text', '  bravo')
      ])),
      u('element', {tagName: 'p', properties: {}}, [
        u('text', 'alpha'),
        u('element', {tagName: 'br', properties: {}}, []),
        u('text', '\n'),
        u('text', 'bravo')
      ]),
      'should trim text after a `br` (#1)'
    );

    st.deepEqual(
      to(u('paragraph', [
        u('text', 'alpha'),
        u('break'),
        u('emphasis', [u('text', '  bravo')])
      ])),
      u('element', {tagName: 'p', properties: {}}, [
        u('text', 'alpha'),
        u('element', {tagName: 'br', properties: {}}, []),
        u('text', '\n'),
        u('element', {tagName: 'em', properties: {}}, [u('text', 'bravo')])
      ]),
      'should trim text after a `br` (#2)'
    );

    st.deepEqual(
      to(u('emphasis', [u('text', 'delta')])),
      u('element', {tagName: 'em', properties: {}}, [u('text', 'delta')]),
      'should transform `emphasis` to `em`'
    );

    st.deepEqual(
      to(u('strong', [u('text', 'echo')])),
      u('element', {tagName: 'strong', properties: {}}, [u('text', 'echo')]),
      'should transform `strong` to `strong`'
    );

    st.deepEqual(
      to(u('delete', [u('text', 'foxtrot')])),
      u('element', {tagName: 'del', properties: {}}, [u('text', 'foxtrot')]),
      'should transform `delete` to `del`'
    );

    st.deepEqual(
      to(u('link', {
        url: 'http://golf.hotel',
        title: 'India'
      }, [u('text', 'juliett')])),
      u('element', {tagName: 'a', properties: {
        href: 'http://golf.hotel',
        title: 'India'
      }}, [u('text', 'juliett')]),
      'should transform `link` to `a`'
    );

    st.deepEqual(
      to(u('link', {
        url: 'http://kilo.lima'
      }, [u('text', 'mike')])),
      u('element', {tagName: 'a', properties: {
        href: 'http://kilo.lima'
      }}, [u('text', 'mike')]),
      'should transform `link` to `a` (missing `title`)'
    );

    st.deepEqual(
      to(u('image', {
        url: 'http://november.oscar',
        alt: 'papa',
        title: 'québec'
      })),
      u('element', {tagName: 'img', properties: {
        src: 'http://november.oscar',
        alt: 'papa',
        title: 'québec'
      }}, []),
      'should transform `image` to `img`'
    );

    st.deepEqual(
      to(u('image', {
        url: 'http://romeo.sierra',
        alt: 'tango'
      })),
      u('element', {tagName: 'img', properties: {
        src: 'http://romeo.sierra',
        alt: 'tango'
      }}, []),
      'should transform `image` to `img` (missing `title`)'
    );

    st.equal(
      to(u('definition', {
        url: 'http://uniform.whiskey',
        identifier: 'x-ray',
        title: 'yankee'
      })),
      null,
      'should ignore `definition`'
    );

    st.equal(
      to(u('footnoteDefinition', {
        identifier: 'zulu'
      }, [u('paragraph', [u('text', 'alpha')])])),
      null,
      'should ignore `footnoteDefinition`'
    );

    st.deepEqual(
      to(u('linkReference', {
        identifier: 'bravo'
      }, [u('text', 'bravo')])),
      [u('text', '['), u('text', 'bravo'), u('text', ']')],
      'should fall back on `linkReference`s without definition'
    );

    st.deepEqual(
      to(u('imageReference', {
        identifier: 'charlie',
        alt: 'charlie'
      })),
      u('text', '![charlie]'),
      'should fall back on `imageReference`s without definition'
    );

    st.deepEqual(
      to(u('linkReference', {
        identifier: 'delta',
        referenceType: 'full'
      }, [u('text', 'echo')])),
      u('element', {tagName: 'a', properties: {
        href: ''
      }}, [u('text', 'echo')]),
      'should not fall back on full `linkReference`s'
    );

    st.deepEqual(
      to(u('imageReference', {
        identifier: 'foxtrot',
        referenceType: 'full',
        alt: 'golf'
      })),
      u('element', {tagName: 'img', properties: {
        src: '',
        alt: 'golf'
      }}, []),
      'should not fall back on full `imageReference`s'
    );

    st.deepEqual(
      to(u('linkReference', {
        identifier: 'hotel',
        referenceType: 'collapsed'
      }, [u('text', 'hotel')])),
      u('element', {tagName: 'a', properties: {
        href: ''
      }}, [u('text', 'hotel')]),
      'should not fall back on collapsed `linkReference`s'
    );

    st.deepEqual(
      to(u('imageReference', {
        identifier: 'india',
        referenceType: 'collapsed',
        alt: 'india'
      })),
      u('element', {tagName: 'img', properties: {
        src: '',
        alt: 'india'
      }}, []),
      'should not fall back on collapsed `imageReference`s'
    );

    st.deepEqual(
      to(u('paragraph', [
        u('linkReference', {
          identifier: 'juliett'
        }, [u('text', 'kilo')]),
        u('definition', {
          identifier: 'juliett',
          url: 'http://kilo.lima/mike',
          title: 'november'
        })
      ])),
      u('element', {tagName: 'p', properties: {}}, [
        u('element', {tagName: 'a', properties: {
          href: 'http://kilo.lima/mike',
          title: 'november'
        }}, [u('text', 'kilo')])
      ]),
      'should transform `linkReference`s to `a`s'
    );

    st.deepEqual(
      to(u('paragraph', [
        u('imageReference', {
          identifier: 'november',
          alt: 'oscar'
        }),
        u('definition', {
          identifier: 'november',
          url: 'http://papa.québec/romeo',
          title: 'sierra'
        })
      ])),
      u('element', {tagName: 'p', properties: {}}, [
        u('element', {tagName: 'img', properties: {
          src: 'http://papa.qu%C3%A9bec/romeo',
          alt: 'oscar',
          title: 'sierra'
        }}, [])
      ]),
      'should transform `imageReference`s to `img`s'
    );

    st.deepEqual(
      to(u('footnoteReference', {
        identifier: 'alpha'
      })),
      u('element', {tagName: 'sup', properties: {
        id: 'fnref-alpha'
      }}, [
        u('element', {tagName: 'a', properties: {
          href: '#fn-alpha',
          className: ['footnote-ref']
        }}, [u('text', 'alpha')])
      ]),
      'should render `footnoteReference`s'
    );

    st.deepEqual(
      to(u('root', [
        u('footnote', [u('text', 'bravo')])
      ])),
      u('root', [
        u('element', {tagName: 'sup', properties: {
          id: 'fnref-1'
        }}, [
          u('element', {tagName: 'a', properties: {
            href: '#fn-1',
            className: ['footnote-ref']
          }}, [u('text', '1')])
        ]),
        u('text', '\n'),
        u('element', {
          tagName: 'div',
          properties: {className: ['footnotes']}
        }, [
          u('text', '\n'),
          u('element', {tagName: 'hr', properties: {}}, []),
          u('text', '\n'),
          u('element', {tagName: 'ol', properties: {}}, [
            u('text', '\n'),
            u('element', {
              tagName: 'li',
              properties: {id: 'fn-1'}
            }, [
              u('text', '\n'),
              u('text', 'bravo'),
              u('text', '\n'),
              u('element', {
                tagName: 'a',
                properties: {
                  href: '#fnref-1',
                  className: ['footnote-backref']
                }
              }, [u('text', '↩')]),
              u('text', '\n')
            ]),
            u('text', '\n')
          ]),
          u('text', '\n')
        ])
      ]),
      'should render `footnote`s (#1)'
    );

    st.deepEqual(
      to(u('root', [
        u('footnoteDefinition', {identifier: '1'}, [u('text', 'bravo')]),
        u('footnoteReference', {identifier: '1'}),
        u('footnote', [u('text', 'charlie')])
      ])),
      u('root', [
        u('element', {tagName: 'sup', properties: {
          id: 'fnref-1'
        }}, [
          u('element', {tagName: 'a', properties: {
            href: '#fn-1',
            className: ['footnote-ref']
          }}, [u('text', '1')])
        ]),
        u('text', '\n'),
        u('element', {tagName: 'sup', properties: {
          id: 'fnref-2'
        }}, [
          u('element', {tagName: 'a', properties: {
            href: '#fn-2',
            className: ['footnote-ref']
          }}, [u('text', '2')])
        ]),
        u('text', '\n'),
        u('element', {
          tagName: 'div',
          properties: {className: ['footnotes']}
        }, [
          u('text', '\n'),
          u('element', {tagName: 'hr', properties: {}}, []),
          u('text', '\n'),
          u('element', {tagName: 'ol', properties: {}}, [
            u('text', '\n'),
            u('element', {
              tagName: 'li',
              properties: {id: 'fn-1'}
            }, [
              u('text', '\n'),
              u('text', 'bravo'),
              u('text', '\n'),
              u('element', {
                tagName: 'a',
                properties: {
                  href: '#fnref-1',
                  className: ['footnote-backref']
                }
              }, [u('text', '↩')]),
              u('text', '\n')
            ]),
            u('text', '\n'),
            u('element', {
              tagName: 'li',
              properties: {id: 'fn-2'}
            }, [
              u('text', '\n'),
              u('text', 'charlie'),
              u('text', '\n'),
              u('element', {
                tagName: 'a',
                properties: {
                  href: '#fnref-2',
                  className: ['footnote-backref']
                }
              }, [u('text', '↩')]),
              u('text', '\n')
            ]),
            u('text', '\n')
          ]),
          u('text', '\n')
        ])
      ]),
      'should render `footnote`s (#2)'
    );

    st.deepEqual(
      to(u('strong', {data: {hName: 'b'}}, [u('text', 'tango')])),
      u('element', {tagName: 'b', properties: {}}, [u('text', 'tango')]),
      'should prefer `data.hName` to tag-names'
    );

    st.deepEqual(
      to(u('strong', {data: {
        hChildren: [u('element', {tagName: 'i', properties: {}}, [u('text', 'tango')])]
      }}, [u('text', 'uniform')])),
      u('element', {tagName: 'strong', properties: {}}, [
        u('element', {tagName: 'i', properties: {}}, [u('text', 'tango')])
      ]),
      'should prefer `data.hChildren` to children'
    );

    st.deepEqual(
      to(u('emphasis', {position: {
        start: {line: 2, column: 3},
        end: {line: 2, column: 12}
      }}, [u('text', 'tango')])),
      u('element', {
        tagName: 'em',
        properties: {},
        position: {
          start: {line: 2, column: 3, offset: null},
          end: {line: 2, column: 12, offset: null}
        }
      }, [u('text', 'tango')]),
      'should patch `position`s when given'
    );

    st.deepEqual(
      to(u('code', {position: {
        start: {line: 1, column: 1},
        end: {line: 3, column: 4}
      }}, 'tango')),
      u('element', {
        tagName: 'pre',
        properties: {},
        position: {
          start: {line: 1, column: 1, offset: null},
          end: {line: 3, column: 4, offset: null}
        }
      }, [
        u('element', {
          tagName: 'code',
          properties: {},
          position: {
            start: {line: 1, column: 1, offset: null},
            end: {line: 3, column: 4, offset: null}
          }
        }, [
          u('text', 'tango\n')
        ])
      ]),
      'should patch `position`s on `pre` and `code`'
    );

    st.deepEqual(
      to(u('foo', 'tango')),
      u('text', 'tango'),
      'should transform unknown texts to `text`'
    );

    st.deepEqual(
      to(u('bar', [u('text', 'tango')])),
      u('element', {tagName: 'div', properties: {}}, [u('text', 'tango')]),
      'should transform unknown parents to `div`'
    );

    st.deepEqual(
      to(u('bar')),
      u('element', {tagName: 'div', properties: {}}, []),
      'should transform unknown nodes to `div`'
    );

    st.end();
  });

  t.end();
});
