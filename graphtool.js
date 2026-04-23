let doc = d3.select(".graphtool");
doc.html(`
  <svg style="display: none;">
    <defs>
      <g id="baseline-icon" text-anchor="middle" font-size="100px" fill="currentColor">
        <text dominant-baseline="central" y="-57">BASE</text>
        <text dominant-baseline="central" y="57">-LINE</text>
      </g>
      <g id="hide-icon">
        <path d="M2 6Q7 0 12 6Q7 12 2 6Z" stroke-width="1" stroke="currentColor" fill="none"/>
        <circle cx="7" cy="6" r="2" stroke="none" fill="currentColor"/>
        <line stroke-width="1" x1="4.4" y1="10.3" x2="10.4" y2="2.3" class="keyBackground"/>
        <line stroke-width="1" x1="3.6" y1= "9.7" x2= "9.6" y2="1.7" stroke="currentColor"/>
      </g>
      <g id="pin-icon" text-anchor="middle" font-size="100px" fill="currentColor">
        <text dominant-baseline="central">
          PIN
        </text>
      </g>
    </defs>
  </svg>

  <main class="main">
    <section class="parts-primary">
    <div class="graphBox" data-sticky-graph="`+ alt_sticky_graph +`" data-animated="`+ alt_animated +`">
      <div class="graph-sizer">
        <svg id="fr-graph" viewBox="0 0 800 360" data-labels-position="`+ labelsPosition +`"></svg>
      </div>

      <div class="tools collapseTools">
        <div class="copy-url">
          <button id="copy-url">Copy URL</button>
          <button id="download-faux">Screenshot</button>
        </div>

        <div class="zoom">
          <span>Zoom:</span>
          <button>Bass</button>
          <button>Mids</button>
          <button>Treble</button>
        </div>

        <div class="normalize">
          <span>Normalize:</span>
          <div>
            <input type="number" inputmode="decimal" id="norm-phon" required min="0" max="100" value="`+ default_norm_db +`" step="1" onclick="this.focus();this.select()"></input>
            <span>dB</span>
          </div>
          <div>
            <input type="number" inputmode="decimal" id="norm-fr" required min="20" max="20000" value="`+ default_norm_hz +`" step="1" onclick="this.focus();this.select()"></input>
            <span>Hz</span>
          </div>
          <span class="helptip">
            ?<span>Choose a dB value to normalize to a target listening level, or a Hz value to make all curves match at that frequency.</span>
          </span>
        </div>

        <div class="smooth">
          <span>Smooth:</span>
          <input type="number" inputmode="decimal" id="smooth-level" required min="0" value="5" step="any" onclick="this.focus();this.select()"></input>
        </div>

        <div class="miscTools">
          <button id="inspector"><span>╞</span> inspect</button>
          <button id="label"><span>▭</span> label</button>
          <button id="download"><span><u>⇩</u></span> screenshot</button>
          <button id="recolor"><span>○</span> recolor</button>
        </div>

        <div class="expand-collapse">
            <button id="expand-collapse"></button>
        </div>

        <svg id="expandTools" viewBox="0 0 14 12">
          <path d="M2 2h10M2 6h10M2 10h10" stroke-width="2px" stroke="#878156"    stroke-linecap="round" transform="translate(0,0.3)"/>
          <path d="M2 2h10M2 6h10M2 10h10" stroke-width="2px" stroke="currentColor" stroke-linecap="round"/>
        </svg>
      </div>
    </div>

      <div class="manage">
        <table class="manageTable">
          <colgroup>
            <col class="remove">
            <col class="phoneId">
            <col class="key">
            <col class="calibrate">
            <col class="baselineButton">
            <col class="hideButton">
            <col class="lastColumn">
          </colgroup>
          <tbody class="curves"></tbody>
          <tr class="addPhone">
            <td class="addButton">⊕</td>
            <td class="helpText" colspan="5">(or middle/ctrl-click when selecting; or pin other IEMs)</td>
            <td class="addLock">LOCK</td>
          </tr>
          <tr class="mobile-helper"></tr>
        </table>
      </div>

      <div class="accessories"></div>

      <div class="external-links"></div>
    </section>

    <section class="parts-secondary">
      <div class="controls">
        <div class="select" data-selected="models">
          <div class="selector-tabs">
            <button class="brands" data-list="brands">Brands</button>
            <button class="models" data-list="models">Models</button>
            <button class="extra">Equalizer</button>
          </div>

          <div class="selector-panel">
            <input class="search" type="text" inputmode="search" placeholder="Search" onclick="this.focus();this.select()"/>

            <svg class="chevron" viewBox="0 0 12 8" preserveAspectRatio="none">
              <path d="M0 0h4c0 1.5,5 3,7 4c-2 1,-7 2.5,-7 4h-4c0 -3,4 -3,4 -4s-4 -1,-4 -4"/>
            </svg>
            <svg class="stop" viewBox="0 0 4 1">
              <path d="M4 1H0C3 1 3.2 0.8 4 0Z"/>
            </svg>

            <div class="scroll-container">
              <div class="scrollOuter" data-list="brands"><div class="scroll" id="brands"></div></div>
              <div class="scrollOuter" data-list="models"><div class="scroll" id="phones"></div></div>
            </div>
          </div>

          <div class="extra-panel" style="display: none;">
            <div class="extra-eq">
              <div class="extra-eq-head">
                <h5 class="extra-eq-panel-title">Parametric Equalizer</h5>
                <div class="extra-eq-head-trailing">
                  <div class="extra-eq-reset-row">
                    <button type="button" id="extra-eq-reset-btn" class="extra-eq-reset-btn" aria-label="Reset EQ band values (frequency, Q, gain) to flat; constraint presets and limits unchanged">
                      <span class="extra-eq-reset-label">Reset</span>
                      <span class="extra-eq-reset-icon" aria-hidden="true"></span>
                    </button>
                  </div>
                  <button type="button" class="extra-eq-constraints-gear" aria-expanded="false" aria-controls="extra-eq-constraints-body" aria-label="Parametric EQ settings" title="Parametric EQ settings"><span class="extra-eq-constraints-gear-char" aria-hidden="true"></span><span class="extra-eq-constraints-gear-preset-badge" aria-hidden="true" hidden>!</span></button>
                </div>
              </div>
              <div class="extra-eq-constraints">
                <div id="extra-eq-constraints-body" class="extra-eq-constraints-body" aria-hidden="true">
                <div class="extra-eq-constraints-inner">
                  <div id="eq-constraint-preset-row" class="eq-constraint-preset-row" hidden>
                    <div class="select-eq-phone eq-constraint-preset-stack">
                      <select id="eq-constraint-preset-display" class="eq-constraint-preset-display" tabindex="-1" aria-hidden="true"></select>
                      <select id="eq-constraint-preset-input" class="eq-constraint-preset-hit" name="eq-constraint-preset" aria-label="Constraint presets" title="Apply a constraint configuration from equalizer-constraints.json"></select>
                    </div>
                  </div>
                  <div class="eq-constraint-top-stack" role="group" aria-label="Filter count and allowed types">
                    <div class="eq-constraint-top-headings">
                      <span class="eq-constraint-col-heading" id="eq-constraint-heading-pk">Peak</span>
                      <span class="eq-constraint-col-heading" id="eq-constraint-heading-lsq">LSQ</span>
                      <span class="eq-constraint-col-heading" id="eq-constraint-heading-hsq">HSQ</span>
                      <span class="eq-constraint-col-heading eq-constraint-col-heading-max-filters">Max Filters</span>
                    </div>
                    <div class="eq-constraint-top-controls">
                      <div class="eq-constraint-top-control-cell">
                        <label class="live-sound-eq-toggle-label extra-eq-constraint-type-switch-label" aria-labelledby="eq-constraint-heading-pk">
                          <span class="live-sound-eq-switch">
                            <span class="live-sound-eq-switch-track">
                              <input type="checkbox" class="eq-constraint-type-toggle eq-constraint-type-pk" checked aria-label="Allow peaking (PK) filters">
                              <span class="live-sound-eq-switch-thumb" aria-hidden="true"></span>
                            </span>
                          </span>
                        </label>
                      </div>
                      <div class="eq-constraint-top-control-cell">
                        <label class="live-sound-eq-toggle-label extra-eq-constraint-type-switch-label" aria-labelledby="eq-constraint-heading-lsq">
                          <span class="live-sound-eq-switch">
                            <span class="live-sound-eq-switch-track">
                              <input type="checkbox" class="eq-constraint-type-toggle eq-constraint-type-lsq" checked aria-label="Allow low shelf (LSQ) filters">
                              <span class="live-sound-eq-switch-thumb" aria-hidden="true"></span>
                            </span>
                          </span>
                        </label>
                      </div>
                      <div class="eq-constraint-top-control-cell">
                        <label class="live-sound-eq-toggle-label extra-eq-constraint-type-switch-label" aria-labelledby="eq-constraint-heading-hsq">
                          <span class="live-sound-eq-switch">
                            <span class="live-sound-eq-switch-track">
                              <input type="checkbox" class="eq-constraint-type-toggle eq-constraint-type-hsq" checked aria-label="Allow high shelf (HSQ) filters">
                              <span class="live-sound-eq-switch-thumb" aria-hidden="true"></span>
                            </span>
                          </span>
                        </label>
                      </div>
                      <div class="eq-constraint-top-control-cell eq-constraint-top-control-cell-max-filters">
                        <input name="eq-constraint-max-bands" class="eq-constraint-max-bands-input" inputmode="numeric" type="number" min="0" max="20" step="1" value="0" aria-label="Maximum active filters (0 = no cap; extra rows stay visible but inactive)" onclick="this.focus();this.select()"></input>
                      </div>
                    </div>
                  </div>
                  <div class="eq-constraint-ranges-block" role="group" aria-label="EQ frequency, gain, and Q limits">
                    <div class="eq-constraint-range-row eq-constraint-range-row-header">
                      <span class="eq-constraint-range-label-slot eq-constraint-ranges-head-cell">Ranges</span>
                      <span class="eq-constraint-range-min-slot eq-constraint-ranges-head-cell">Min</span>
                      <span class="eq-constraint-range-max-slot eq-constraint-ranges-head-cell">Max</span>
                    </div>
                    <div class="eq-constraint-range-row eq-constraint-freq-row">
                      <span class="eq-constraint-range-label-slot eq-constraint-range-name">Frequency</span>
                      <div class="eq-constraint-freq-parametric-cells">
                        <span class="eq-constraint-range-min-slot eq-constraint-range-cell"><input name="eq-constraint-freq-min" inputmode="decimal" type="text" value="0" aria-label="Minimum EQ frequency (0 = no limit); for graphic bands when max is unlimited use comma then space between Hz (e.g. 32, 64, 125)" title="0 = no limit. With max also 0, use comma + space between Hz (e.g. 32, 64, 125) for graphic EQ — not 2,000 (thousands)." onclick="this.focus();this.select()"></input></span>
                        <span class="eq-constraint-range-max-slot eq-constraint-range-cell eq-constraint-input-with-unit eq-constraint-unit-hz"><input name="eq-constraint-freq-max" inputmode="decimal" type="text" value="0" aria-label="Maximum EQ frequency (0 = no limit); for graphic bands when min is unlimited use comma then space between Hz (e.g. 32, 64, 125)" title="0 = no limit. With min also 0, use comma + space between Hz (e.g. 32, 64, 125) for graphic EQ." onclick="this.focus();this.select()"></input></span>
                      </div>
                      <div class="eq-constraint-freq-graphic-full" hidden>
                        <input name="eq-constraint-freq-graphic-list" type="text" class="eq-constraint-freq-graphic-list-input" inputmode="text" value="" autocomplete="off" spellcheck="false" aria-label="Graphic EQ band frequencies in Hz; use a comma then space between values (e.g. 32, 64, 125)" title="Hz with comma + space between bands (e.g. 32, 64, 125, 250). Clear to return to min/max limits." onclick="this.focus();this.select()"></input>
                      </div>
                    </div>
                    <div class="eq-constraint-range-row">
                      <span class="eq-constraint-range-label-slot eq-constraint-range-name">Gain</span>
                      <span class="eq-constraint-range-min-slot eq-constraint-range-cell"><input name="eq-constraint-gain-min" inputmode="decimal" type="number" min="-40" max="40" step="0.1" value="0" aria-label="Minimum gain dB (0 = no limit)" onclick="this.focus();this.select()"></input></span>
                      <span class="eq-constraint-range-max-slot eq-constraint-range-cell eq-constraint-input-with-unit eq-constraint-unit-db"><input name="eq-constraint-gain-max" inputmode="decimal" type="number" min="-40" max="40" step="0.1" value="0" aria-label="Maximum gain dB (0 = no limit)" onclick="this.focus();this.select()"></input></span>
                    </div>
                    <div class="eq-constraint-range-row">
                      <span class="eq-constraint-range-label-slot eq-constraint-range-name">Q</span>
                      <span class="eq-constraint-range-min-slot eq-constraint-range-cell"><input name="eq-constraint-q-min" inputmode="decimal" type="number" min="0" max="10" step="0.1" value="0" aria-label="Minimum Q (0 = no limit)" onclick="this.focus();this.select()"></input></span>
                      <span class="eq-constraint-range-max-slot eq-constraint-range-cell"><input name="eq-constraint-q-max" inputmode="decimal" type="number" min="0" max="10" step="0.1" value="0" aria-label="Maximum Q (0 = no limit)" onclick="this.focus();this.select()"></input></span>
                    </div>
                  </div>
                  <div class="eq-constraint-2ch-row" role="group" aria-label="Stereo EQ banks">
                    <label class="live-sound-eq-toggle-label eq-constraint-2ch-toggle-label"
                        title="Both bank applies to L and R; L and R banks add channel-specific filters on top. With Compare on (live EQ / B), live playback runs separate L/R chains (mono sources are duplicated to each side).">
                      <span class="live-sound-eq-toggle-text">2-Channel Support</span>
                      <span class="live-sound-eq-switch">
                        <span class="live-sound-eq-switch-track">
                          <input type="checkbox" name="eq-constraint-2ch" class="eq-constraint-2ch-toggle" aria-label="Enable separate left and right EQ filter banks"/>
                          <span class="live-sound-eq-switch-thumb" aria-hidden="true"></span>
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              </div>
              <div class="select-eq-phone select-eq-phone-model-target">
                <select name="phone">
                    <option value="" selected>Add a model to the graph</option>
                </select>
                <div class="select-eq-phone-target-row">
                  <div class="select-eq-target-select-wrap">
                    <select name="eq-target" aria-label="AutoEQ target curve" title="Trace AutoEQ matches the selected model against">
                        <option value="" selected>Target: Add a target to the graph</option>
                    </select>
                  </div>
                  <button type="button" class="autoeq extra-eq-secondary-btn">Auto EQ</button>
                </div>
                <div id="eq-2ch-bank-tabs" class="eq-2ch-bank-tabs" role="tablist" aria-label="EQ filter bank (keyboard L, R, A = all when Extra tab is open)" title="Shortcuts: L = left bank, R = right bank, A = L + R (all channels; not while typing in text fields)" hidden>
                  <div class="eq-2ch-bank-seg-track" data-eq-2ch-pos="1">
                    <span class="eq-2ch-bank-seg-thumb" aria-hidden="true"></span>
                    <div class="eq-2ch-bank-seg-slot" data-slot="L">
                      <span class="eq-2ch-bank-seg-label">L</span>
                      <button type="button" role="tab" class="eq-2ch-bank-seg-btn" data-eq-2ch-bank="L" aria-selected="false" tabindex="-1" aria-label="Left channel filter bank"></button>
                    </div>
                    <div class="eq-2ch-bank-seg-slot" data-slot="both">
                      <span class="eq-2ch-bank-seg-label">L + R</span>
                      <button type="button" role="tab" class="eq-2ch-bank-seg-btn" data-eq-2ch-bank="both" aria-selected="true" tabindex="0" aria-label="L + R — all channels (shared) filter bank"></button>
                    </div>
                    <div class="eq-2ch-bank-seg-slot" data-slot="R">
                      <span class="eq-2ch-bank-seg-label">R</span>
                      <button type="button" role="tab" class="eq-2ch-bank-seg-btn" data-eq-2ch-bank="R" aria-selected="false" tabindex="-1" aria-label="Right channel filter bank"></button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="filters-header">
                <span>Type</span>
                <span>Frequency</span>
                <span>Gain</span>
                <span>Q</span>
              </div>
              <div class="filters">
                <div class="filter">
                    <span>
                      <input name="enabled" type="checkbox" checked tabindex="-1" aria-label="Enable filter band"></input>
                      <select name="type" tabindex="-1" aria-label="Filter type (PK, LSQ, HSQ)">
                        <option value="PK" selected>PK</option>
                        <option value="LSQ">LSQ</option>
                        <option value="HSQ">HSQ</option>
                      </select>
                    </span>
                    <span><input name="freq" inputmode="decimal" type="number" min="20" max="20000" step="1" value="0" onclick="this.focus();this.select()"></input></span>
                    <span><input name="gain" inputmode="text" type="number" min="-40" max="40" step="0.1" value="0" onclick="this.focus();this.select()"></input></span>
                    <span><input name="q" inputmode="decimal" type="number" min="0" max="10" step="0.1" value="0" onclick="this.focus();this.select()"></input></span>
                </div>
              </div>
              <div class="filters-button">
                <button class="add-filter">＋</button>
                <button class="remove-filter">－</button>
                <button class="sort-filters">Sort</button>
              </div>
              <div class="filters-button extra-eq-filter-actions">
                <button class="import-filters">Import</button>
                <button class="export-filters">Export</button>
              </div>
              <div class="filters-button extra-eq-filter-actions">
                <button class="export-graphic-filters extra-eq-secondary-btn">Export Graphic EQ (Wavelet)</button>
              </div>
              <a style="display: none" id="file-filters-export"></a>
              <form style="display:none"><input type="file" id="file-filters-import" accept=".txt" /></form>
            </div>
            <div class="live-sound-tools">
              <div class="live-sound-tools-head">
                <h5 class="live-sound-tools-title">Sound Tools</h5>
                <label class="live-sound-eq-toggle-label">
                  <span class="live-sound-eq-toggle-text">Compare</span>
                  <span class="live-sound-eq-switch">
                    <span class="live-sound-eq-switch-track live-sound-eq-switch-track--compare">
                      <input type="checkbox" class="live-sound-eq-toggle" checked aria-label="Compare: when on (B), live playback uses parametric EQ; when off (A), reference path" />
                      <span class="live-sound-eq-switch-thumb live-sound-eq-switch-thumb--compare" aria-hidden="true"><span class="live-sound-eq-switch-thumb-letter live-sound-eq-switch-thumb-letter--a">A</span><span class="live-sound-eq-switch-thumb-letter live-sound-eq-switch-thumb-letter--b">B</span></span>
                      <span class="live-sound-eq-switch-ab-placeholder live-sound-eq-switch-ab-placeholder--a" aria-hidden="true"><span class="live-sound-eq-switch-ab-placeholder-ring"><span class="live-sound-eq-switch-ab-placeholder-letter">A</span></span></span>
                      <span class="live-sound-eq-switch-ab-placeholder live-sound-eq-switch-ab-placeholder--b" aria-hidden="true"><span class="live-sound-eq-switch-ab-placeholder-ring"><span class="live-sound-eq-switch-ab-placeholder-letter">B</span></span></span>
                    </span>
                  </span>
                </label>
              </div>
              <div class="live-sound-sources">
                <div class="live-sound-source extra-pink-noise">
                  <div class="live-sound-source-head">
                    <span class="live-sound-source-title">Pink Noise</span>
                  </div>
                  <div class="live-sound-source-actions">
                    <button type="button" class="play" aria-label="Toggle pink noise playback"></button>
                  </div>
                </div>
                <div class="live-sound-source extra-tone-generator">
                  <div class="live-sound-source-head">
                    <span class="live-sound-source-title">Tone Generator</span>
                  </div>
                  <div class="live-sound-source-actions tone-generator-play-row">
                    <button type="button" class="play" aria-label="Toggle tone playback"></button>
                  </div>
                  <div class="live-sound-slider-row tone-generator-slider-row">
                    <input name="tone-generator-freq" type="range" min="0" max="1" step="0.0001" value="0" aria-label="Tone frequency along band" />
                    <span class="live-sound-tone-freq-display"><span class="freq-text">1000</span> Hz</span>
                  </div>
                  <div class="live-sound-tone-create-filter">
                    <button type="button" class="tone-generator-add-filter">+ Add Filter</button>
                  </div>
                </div>
                <div class="live-sound-source extra-music">
                  <div class="live-sound-source-head">
                    <span class="live-sound-source-title">Music</span>
                  </div>
                  <div class="music-playback-panel" aria-hidden="true">
                    <div class="music-playback-panel-inner">
                      <div class="live-sound-source-actions music-play-row">
                        <button type="button" class="play" disabled aria-label="Toggle music playback"></button>
                      </div>
                      <div class="live-sound-slider-row music-slider-row">
                        <div class="music-segment-slider music-segment-slider-disabled" role="group" aria-label="Playback and loop range">
                          <div class="music-segment-track">
                            <div class="music-segment-rail-bg" aria-hidden="true"></div>
                            <div class="music-segment-outside music-segment-outside-l" aria-hidden="true"></div>
                            <div class="music-segment-outside music-segment-outside-r" aria-hidden="true"></div>
                            <div class="music-segment-looped" aria-hidden="true"></div>
                            <div class="music-segment-progress" aria-hidden="true"></div>
                            <div class="music-segment-seek"></div>
                            <button type="button" class="music-segment-handle music-segment-handle-start" tabindex="-1" aria-label="Loop start"></button>
                            <button type="button" class="music-segment-handle music-segment-handle-end" tabindex="-1" aria-label="Loop end"></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="live-sound-music-file">
                    <button type="button" class="music-add-remove">+ Add Music</button>
                    <input type="file" class="music-file-input" tabindex="-1" aria-hidden="true"
                        accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/x-aac,audio/aac,audio/wav,audio/x-wav,audio/flac,audio/ogg,audio/opus,audio/webm,.mp3,.m4a,.aac,.wav,.caf,.flac,.ogg,.opus,.webm,audio/*" />
                  </div>
                </div>
              </div>
              <div class="live-sound-band">
                <span class="live-sound-band-label live-sound-band-heading">Range</span>
                <div class="live-sound-band-controls">
                  <div class="live-sound-range-reset-row">
                    <button type="button" id="live-sound-range-reset-btn" class="live-sound-range-reset-btn" aria-label="Reset Sound Tools frequency range to full band (20 Hz – 20 kHz)" title="Reset range to full band (20 Hz – 20 kHz)">
                      <span class="live-sound-range-reset-label">Reset</span>
                      <span class="live-sound-range-reset-icon" aria-hidden="true"></span>
                    </button>
                  </div>
                  <div class="live-sound-range-pair">
                    <span><input name="tone-generator-from" inputmode="decimal" type="number" min="20" max="20000" step="1" value="20" aria-label="Minimum frequency" onclick="this.focus();this.select()"></input></span>
                    <span><input name="tone-generator-to" inputmode="decimal" type="number" min="20" max="20000" step="1" value="20000" aria-label="Maximum frequency" onclick="this.focus();this.select()"></input></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="extra-upload">
              <div class="extra-upload-head">
                <h5 class="extra-upload-data-title">Upload Data</h5>
                <span class="extra-upload-note">Warning: Measurements from another rig are not compatible with measurements or targets in this database.</span>
                <div class="extra-upload-actions">
                  <button type="button" class="upload-fr">Upload FR</button>
                  <button type="button" class="upload-target">Upload Target</button>
                </div>
              </div>
              <form style="display:none"><input type="file" id="file-fr" accept=".csv,.txt" /></form>
            </div>
            <div class="extra-eq-change-history" id="extra-eq-change-history" hidden>
              <div class="extra-eq-change-history-head">
                <h5 class="extra-eq-change-history-title">Change History</h5>
                <p class="extra-eq-change-history-hint">Undo: Ctrl+Z / ⌘Z, Redo: Shift+Ctrl+Z / Shift+⌘Z</p>
              </div>
              <div class="extra-eq-change-history-list" id="extra-eq-change-history-list" role="list"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div style="display: none" class="extra-eq-overlay">AutoEQ is running, it could take 5~20 seconds or more.</div>
  </main>
`);


let pad = { l:15, r:15, t:10, b:36 };
let W0 = 800, W = W0 - pad.l - pad.r,
    H0 = 360, H = H0 - pad.t - pad.b;

let gr = doc.select("#fr-graph"),
    defs = gr.append("defs");


gr.append("rect").attrs({x:0, y:pad.t-8, width:W0, height:H0-22, rx:4,
                         "class":"graphBackground"});
watermark(gr);


// Scales
let x = d3.scaleLog()
    .domain([20,20000])
    .range([pad.l,pad.l+W]);

let yD = [29.5,85], // Decibels
    yR = [pad.t+H,pad.t+10];
let y = d3.scaleLinear().domain(yD).range(yR);


// y axis
defs.append("filter").attr("id","blur").attr("filterUnits","userSpaceOnUse")
    .attrs({x:-W-4,y:-2,width:W+8,height:4})
    .append("feGaussianBlur").attr("in","SourceGraphic")
    .attr("stdDeviation", 0.8);
let yAxis = d3.axisLeft(y).tickSize(W).tickSizeOuter(0).tickPadding(1);
function fmtY(ya) {
    let d = y.domain(),
        r = d[1] - d[0],
        t = r<40 ? 1 : 5,
        y0= Math.ceil (d[0]/t),
        y1= Math.floor(d[1]/t),
        isMinor = t===5 ? (()=>false) : ((_,i)=>(y0+i)%5!==0);
    yAxis.tickValues(d3.range(y1-y0+1).map(i=>t*(y0+i)))(ya);
    ya.select(".domain").remove();
    ya.selectAll(".tick line")
      .attr("stroke-linecap", "round")
      .attrs((_,i) => {
          let m = isMinor(_,i);
          return {
              filter: m ? null : "url(#blur)",
              "stroke-width": m ? 0.2*(1-r/45) : 0.15*(1+45/r)
          };
      });
    ya.selectAll(".tick text")
      .attr("text-anchor","start")
      .attr("x",-W+3)
      .attr("dy",-2)
      .filter(isMinor).attr("display","none");
}
let yAxisObj = gr.append("g")
    .attr("transform", "translate("+(pad.l+W)+",0)")
    .call(fmtY);
yAxisObj.insert("text")
    .attr("transform","rotate(-90)")
    .attr("fill","currentColor")
    .attr("text-anchor","end")
    .attr("y",-W-2).attr("x",-pad.t)
    .text("dB");


// x axis
let xvals = [2,3,4,5,6,8,10,15];
let xAxis = d3.axisBottom(x)
    .tickSize(H+3).tickSizeOuter(0)
    .tickValues(d3.merge([1,2,3].map(e=>xvals.map(m=>m*Math.pow(10,e)))).concat([20000]))
    .tickFormat(f => f>=1000 ? (f/1000)+"k" : f);

let tickPattern = [3,0,0,1,0,0,2,0],
    getTickType = i => i===0 || i===3*8 ? 4 : tickPattern[i%8],
    tickThickness = [2,4,4,9,15].map(t=>t/10);

function fmtX(xa) {
    xAxis(xa);
    (xa.selection ? xa.selection() : xa).select(".domain").remove();
    xa.selectAll(".tick line")
      .attr("y1", 10)
      .attr("y2", 312)
      .attr("stroke", "#333")
      .attr("stroke-width", (_,i) => tickThickness[getTickType(i)]);
    xa.selectAll(".tick text").filter((_,i) => tickPattern[i%8] === 0)
      .attr("font-size","86%")
      .attr("font-weight","lighter");
    xa.select(".tick:last-of-type text")
      .attr("dx",-5)
      .text("20kHz");
    xa.select(".tick:first-of-type text")
      .attr("dx",4)
      .text("20Hz");
}
defs.append("clipPath").attr("id","x-clip")
    .append("rect").attrs({x:0, y:0, width:W0, height:H0});
let xAxisObj = gr.append("g")
    .attr("clip-path", "url(#x-clip)")
    .attr("transform", "translate(0,"+pad.t+")")
    .call(fmtX);


// Plot line
defs.selectAll().data([0,1]).join("linearGradient")
    .attrs({x1:0,y1:0, x2:1,y2:0})
    .attr("id", i=>"grad"+i)
    .selectAll().data(i=>[i,1-i]).join("stop")
    .attr("offset",(_,i)=>i)
    .attr("stop-color",j=>["black","white"][j]);
let fW = 7,  // Fade width
    fWm= 30; // Width at an interior edge
let fade = defs.append("mask")
    .attr("id", "graphFade")
    .attr("maskUnits", "userSpaceOnUse")
    .append("g").attr("transform", "translate("+pad.l+","+pad.t+")");
fade.append("rect").attrs({ x:0, y:0, width:W, height:H, fill:"white" });
let fadeEdge = fade.selectAll().data([0,1]).join("rect")
    .attrs(i=>({ x:i?W-fW:0, width:fW, y:0,height:H, fill:"url(#grad"+i+")" }));
let spectrumClipBleed = 4;
defs.append("clipPath").attr("id", "spectrum-clip-inner")
    .append("rect").attrs({
        x: -spectrumClipBleed,
        y: -spectrumClipBleed,
        width: W + 2 * spectrumClipBleed,
        height: H + 2 * spectrumClipBleed
    });
let line = d3.line()
    .x(d=>x(d[0]))
    .y(d=>y(d[1]))
    .curve(d3.curveNatural);


// Range buttons
let selectedRange = 3; // Full range
let ranges = [[20,400],[100,4000],[1000,20000], [20,20000]],
    edgeWs = [[fW,fWm],[fWm,fWm],[fWm,fW],[fW,fW]];
let rangeSel = doc.select(".zoom").selectAll("button");
rangeSel.on("click", function (_,i) {
    let r = selectedRange,
        s = selectedRange = r===i ? 3 : i;
    rangeSel.classed("selected", (_,j)=>j===s);
    x.domain(ranges[s]);
    // More time to go between bass and treble
    let dur = Math.min(r,s)===0 && Math.max(r,s)===2 ? 1100 : 700;
    clearLabels();
    gpath.selectAll("path").transition().duration(dur).attr("d", drawLine)
        .on("end", () => updateEqFilterMarkers());
    let e = edgeWs[s];
    fadeEdge.transition().duration(dur).attrs(i=>({x:i?W-e[i]:0, width:e[i]}));
    xAxisObj.transition().duration(dur).call(fmtX);
});


// y-axis scaler
let dB = {
    y: y(60),
    h: 15,
    H: y(60)-y(70),
    min: pad.t,
    max: pad.t+H,
    tr: _ => "translate("+(pad.l-9)+","+dB.y+")"
};
dB.all = gr.append("g").attr("class","dBScaler"),
dB.trans = dB.all.append("g").attr("transform", dB.tr()),
dB.scale = dB.trans.append("g").attr("transform", "scale(1,1)");
dB.scale.selectAll().data([-1,1])
    .join("path").attr("stroke","none")
    .attr("d", function (s) {
        function getPathPart(l) {
            let v=l[0].toLowerCase()==="v";
            for (let i=2-v; i<l.length; i+=2)
                l[i] *= s;
            return l[0]+l.slice(1).join(" ");
        }
        return [ ["M", 9.9,-1   ],
                 ["V",      dB.H],
                 ["h",-1        ],
                 ["l",-1  ,-1.5 ],
                 ["l",-2.1, 2   ],
                 ["h",-5.6      ],
                 ["v",     -1.5 ],
                 ["q",7,2,8,-7  ],
                 ["V",     29   ],
                 ["c",1,-16,-10,-15,-10,-14],
                 ["V",     -1   ] ].map(getPathPart).join("");
    });
dB.scale.selectAll().data([10,7,13])
    .join("rect").attrs((d,i)=>({x:i*2.8,y:-d,width:0.8,height:2*d,fill:"#bbb"}));
function getDrag(fn) {
    return d3.drag()
        .on("drag",fn)
        .on("start",function(){dB.all.classed("active",true );})
        .on("end"  ,function(){dB.all.classed("active",false);});
}
dB.mid = dB.all.append("rect")
    .attrs({x:(pad.l-11),y:dB.y-dB.h,width:12,height:2*dB.h,opacity:0})
    .call(getDrag(function () {
        dB.y = d3.event.y;
        dB.y = Math.min(dB.y, dB.max-dB.h*(dB.H/15));
        dB.y = Math.max(dB.y, dB.min+dB.h*(dB.H/15));
        d3.select(this).attr("y",dB.y-dB.h);
        dB.trans.attr("transform", dB.tr());
        dB.updatey();
    }));
dB.circ = dB.trans.selectAll().data([-1,1]).join("circle")
    .attrs({cx:5,cy:s=>dB.H*s,r:7,opacity:0})
    .call(getDrag(function () {
        let h  = Math.max(30, Math.abs(d3.event.y));
        h = Math.min(h, Math.min(dB.max-dB.y, dB.y-dB.min));
        let sc = h/dB.H;
        dB.circ.attr("cy",s=>h*s);
        dB.scale.attr("transform", "scale(1,"+sc+")");
        dB.h = 15*sc;
        dB.mid.attrs({y:dB.y-dB.h,height:2*dB.h});
        dB.updatey();
    }));
let yCenter = 60;
dB.updatey = function (dom) {
    let d = l => l[1]-l[0];
    y.domain(yR.map(y=>yCenter+(y-dB.y)*(15/dB.h)*d(yD)/d(yR)));
    yAxisObj.call(fmtY);
    let getTr = o => o ? "translate(0,"+(y(o)-y(0))+")" : null;
    clearLabels();
    gpath.selectAll("path").call(redrawLine);
    updateEqFilterMarkers();
}


// Label drawing and screenshot
let getFullName = p => p.dispBrand+" "+p.dispName,
    getChannelName = p => n => getFullName(p) + " ("+n+")";

let labelButton = doc.select("#label"),
    labelsShown = false;
function setLabelButton(l) {
    labelButton.classed("selected", labelsShown = l);
}
function clearLabels() {
    gr.selectAll(".lineLabel").remove();
    setLabelButton(false);
}

function drawLabels() {
    let curves = d3.merge(
        activePhones.filter(p=>!p.hide).map(p =>
            p.isTarget||!p.samp||p.avg ? p.activeCurves
            : LR.map((l,i) => ({
                p:p, o:getO(i), id:getChannelName(p)(l), multi:true,
                l:(n=>p.channels.slice(i*n,(i+1)*n))(sampnums.length)
                    .filter(c=>c!==null)
              }))
        )
    );
    if (!curves.length) return;

    let bcurves = curves.slice(),
        bp = baseline.p;
    if (bp && bp.hide) {
        bcurves.push({
            p:bp, o:0,
            id:"Baseline: "+(bp.isTarget?bp.fullName:getFullName(bp))
        });
    }

    gr.selectAll(".lineLabel").remove();
    let g = gr.selectAll(".lineLabel").data(bcurves)
        .join("g").attr("class","lineLabel").attr("opacity", 0)
        .attr("pointer-events", "none");
    let t = g.append("text")
        .attrs({x:0, y:0, fill:c=>getTooltipColor(c)})
        .text(c=>c.id);
    g.datum(function(){return this.getBBox();});
    g.select("text").attrs(b=>({x:3-b.x, y:3-b.y}));
    g.insert("rect", "text")
        .attrs(b=>({x:2, y:2, width:b.width+2, height:b.height+2}));
    let boxes = g.data(),
        w = boxes.map(b=>b.width +6),
        h = boxes.map(b=>b.height+6);

    // Slice to fit in range
    let r = x.domain().map(v => d3.bisectLeft(f_values, v));
    rsl = a => a.slice(Math.max(r[0],0), r[1]+1);
    let rf_values = rsl(f_values);
    let v = curves.map(c => {
        let o = getOffset(c.p);
        return (c.multi?c.l:[c.l])
            .map(l => rsl(baseline.fn(l).map(d=>d[1]+o)));
    });
    let tr;

    if (curves.length === 1) {
        let x0 = 50, y0 = 10,
            sl = range_to_slice([0,w[0]], o=>x0+o),
            e = d3.extent(d3.merge(v[0].map(sl)).map(y));
        if (y0+h[0] >= e[0]) { y0 = Math.max(y0, e[1]); }
        tr = [[x0,y0]];
    } else {
        let n = v.length;
        let invd = (sc,d) => sc.invert(d)-sc.invert(0),
            xr = x.range(),
            yd = y.domain(),
            wind = w => Math.ceil((w/(xr[1]-xr[0]))*rf_values.length),
            mw = wind(d3.min(w));
        let winReduce = (l,w,d0,fn) => {
            l = l.slice();
            for (let d=d0; d<w; ) {
                let diff = Math.min(2*d,w) - d;
                for (let i=0; i<l.length-diff; i++) {
                    l[i] = fn(l[i], l[i+diff]);
                }
                d += diff;
            }
            l.length -= w-d0;
            return l;
        }
        let rangeGetters = [Math.min, Math.max].map(f => {
            let r = c => c.reduce((a,b)=>a.map((ai,i)=>f(ai,b[i])));
            let t = v.map(c => winReduce(r(c), mw, 1, f));
            return w => t.map(c => winReduce(c, w, mw, f));
        });
        let top = 0; // Use top left if we can't find a spot
        tr = v.map((_,j) => {
            let we = wind(w[j]),
                he = -invd(y,h[j]),
                range = d3.transpose(rangeGetters.map(r => r(we))),
                ds;
            ds = range[j].map(function (r,ri) {
                let le = r.length,
                    s = [[-he,0],[0,he]][ri].map(o=>r.map(d=>d+o)),
                    d = r.map(_=>1e10);
                for (let k=0; k<n; k++) if (k!==j) {
                    let t = range[k];
                    for (let i=0; i<le; i++) {
                        d[i] = Math.min(d[i], Math.max(s[0][i]-t[1][i],
                                                       t[0][i]-s[1][i]));
                    }
                }
                return d;
            });
            let sep = 0, pos = null;
            ds.forEach(function (drow,k) {
                for (let ii=0; ii<drow.length; ) {
                    let i=ii, d=drow[i],
                        rjk=range[j][k], m=rjk[i];
                    while (ii++, ii<drow.length && rjk[ii]===m) {
                        let di = drow[ii];
                        if (di<d && di<1) break;
                        d = Math.max(d,drow[ii]);
                    }
                    let clip = x => x/Math.sqrt(1+x*x);
                    d = 4*clip(d/4) + clip((ii-i)/3);
                    i = Math.floor((i+ii)/2);
                    let dl = drow.length,
                        r = i/dl;
                    d *= Math.sqrt((0.8+r)*Math.sqrt(1-r));
                    d *= clip(0.2+Math.max(0,(i>=15?drow[i-15]:0)+(i<dl-15?drow[i+15]:0)));
                    if (d>sep) {
                        let dy = range[j][k][i]+(k?he:0),
                            yd = y.domain();
                        if (yd[0]+he<=dy && dy<=yd[1]) { sep=d; pos=[i,dy]; }
                    }
                }
            });
            return pos ? [x(rf_values[pos[0]]), y(pos[1])]
                       : [60, 20+30*top++];
        });
    }
    for (let j=curves.length; j<bcurves.length; j++) {
        tr.push([pad.l+(W-w[j])/2, pad.t+H-h[j]+2]);
    }
    g.attr("transform",(_,i)=>"translate("+tr[i].join(",")+")");
    g.attr("opacity",null);
    setLabelButton(true);
    gEqFilterMarkers.raise();
    gEqHoverPreview.raise();
}

labelButton.on("click", () => (labelsShown?clearLabels:drawLabels)());

function saveGraph(ext) {
    let fn = {png:saveSvgAsPng, svg:saveSvg}[ext];
    let showControls = s => dB.all.attr("visibility",s?null:"hidden");
    gpath.selectAll("path").classed("highlight",false);
    drawLabels();
    showControls(false);
    fn(gr.node(), "graph."+ext, {scale:3})
        .then(()=>showControls(true));
    
    // Analytics event
    if (analyticsEnabled) { pushEventTag("clicked_download", targetWindow); }
}
doc.select("#download")
    .on("click", () => saveGraph("png"))
    .on("contextmenu", function () {
        d3.event.returnValue=false;
        let b = d3.select(this);
        let choice = b.selectAll("div")
            .data(["png","svg"]).join("div")
            .styles({position:"absolute", left:0, top:(_,i)=>i*1.3+"em",
                     background:"inherit", padding:"0.1em 1em"})
            .text(d => "As ."+d)
            .on("click", function (d) {
                saveGraph(d);
                choice.remove();
                d3.event.stopPropagation();
            });
        b.on("blur", ()=>choice.remove());
    });


// Graph smoothing
let pair = (arr,fn) => arr.slice(1).map((v,i)=>fn(v,arr[i]));

function smooth_prep(h, d) {
    let rh = h.map(d=>1/d),
        G = [ rh.slice(0,rh.length-1),
              pair(rh, (a,b)=>-(a+b)),
              rh.slice(1) ],
        dv = d3.range(rh.length+1).map(i=>d(i)),
        dG = G.map((r,j) => r.map((e,i) => e*dv[i+j])),
        d2 = dv.map(e=>e*e),
        h6 = h.map(d=>d/6),
        M = [ pair(h6, (a,b)=>2*(a+b)),
              h6.slice(1,h6.length-1),
              h6.slice(3).map(_=>0) ];
    dG.forEach((_,k) =>
        dG.slice(k).forEach((g,i) =>
            dG[i].slice(k).forEach((a,j) => M[k][j] += a*g[j])
        )
    );

    // Diagonal LDL decomposition of M
    let md = [M[0][0]],
        ml = M.slice(1).map(m=>[m[0]/md]);
    d3.range(1,M[0].length).forEach(j => {
        let n = ml.length,
            p = md.slice(-n).reverse().map((d,i)=>d*ml[i][j-1-i]),
            a = M.map((m,k) => m[j] - d3.sum(p.slice(0,n-k),
                      (a,i) => a*ml[k+i][j-1-i]));
        md.push(a[0]);
        ml.forEach((l,j)=>l.push(a[j+1]/a[0]));
    });

    return { G:G, md:md, ml:ml, d2:d2 };
}

function smooth_eval(p, y) {
    let Gy = p.G[0].map(_=>0),
        n = Gy.length;
    p.G.forEach((r,j) => r.forEach((e,i) => Gy[i] += e*y[i+j]));
    // Forward substitution and multiply by p.md
    for (let i=0; i<n; i++) {
        let yi = Gy[i];
        p.ml.forEach((m,k) => { let j=i+k+1; if (j<n) Gy[j] -= m[i]*yi; });
        Gy[i] /= p.md[i];
    }
    // Back substitution
    for (let i=n; i--; ) {
        let yi = Gy[i];
        p.ml.forEach((m,k) => { let j=i-k-1; if (j>=0) Gy[j] -= m[j]*yi; });
    }
    let u = y.slice();
    p.G.forEach((r,j) => r.forEach((e,i) => u[i+j] -= e*p.d2[i+j]*Gy[i]));
    return u;
}

let smooth_level = 5,
    smooth_scale = 0.01*(typeof scale_smoothing !== "undefined" ? scale_smoothing : 1),
    smooth_param = undefined;
function smooth(y, c) {
    if (smooth_level === 0) { return y; }
    let get_param = fv => {
        let x = fv.map(f=>Math.log(f)),
            h = pair(x, (a,b)=>a-b),
            s = smooth_level*smooth_scale,
            d = i => s*Math.pow(1/80,Math.pow(i/x.length,2));
        return smooth_prep(h, d);
    }
    let p;
    if (y.length!==f_values.length) {
        p = get_param(c.map(d=>d[0]));
    } else {
        if (!smooth_param) { smooth_param = get_param(f_values); }
        p = smooth_param;
    }
    return smooth_eval(p, y);
}

function smoothPhone(p) {
    if (!p.rawChannels) return;
    if (p.smooth !== smooth_level) {
        p.channels = p.rawChannels.map(
            c=>c?smooth(c.map(d=>d[1]),c).map((d,i)=>[c[i][0],d]):c
        );
        p.smooth = smooth_level;
        setCurves(p);
    }
}

doc.select("#smooth-level").on("change input", function () {
    if (!this.checkValidity()) return;
    smooth_level = +this.value;
    smooth_param = undefined;
    line.curve(smooth_level ? d3.curveNatural : d3.curveCardinal.tension(0.5));
    activePhones.forEach(smoothPhone);
    updatePaths();
});


// Normalization with target loudness
const iso223_params = { // :2003
    f  : [   20,    25, 31.5,    40,    50,    63,    80,   100,   125,  160,   200,   250,   315,   400,   500,   630,   800, 1000,  1250,  1600,  2000,  2500,  3150,  4000,  5000,  6300,  8000, 10000, 12500],
    a_f: [0.532, 0.506, 0.48, 0.455, 0.432, 0.409, 0.387, 0.367, 0.349, 0.33, 0.315, 0.301, 0.288, 0.276, 0.267, 0.259, 0.253, 0.25, 0.246, 0.244, 0.243, 0.243, 0.243, 0.242, 0.242, 0.245, 0.254, 0.271, 0.301],
    L_U: [-31.6, -27.2,  -23, -19.1, -15.9,   -13, -10.3,  -8.1,  -6.2, -4.5,  -3.1,    -2,  -1.1,  -0.4,     0,   0.3,   0.5,    0,  -2.7,  -4.1,    -1,   1.7,   2.5,   1.2,  -2.1,  -7.1, -11.2, -10.7,  -3.1],
    T_f: [ 78.5,  68.7, 59.5,  51.1,    44,  37.5,  31.5,  26.5,  22.1, 17.9,  14.4,  11.4,   8.6,   6.2,   4.4,     3,   2.2,  2.4,   3.5,   1.7,  -1.3,  -4.2,    -6,  -5.4,  -1.5,     6,  12.6,  13.9,  12.3]
};
const free_field = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0725,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0896,0,0,0,0,0,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0967,0,0,0,0,0,0,0,0.0886,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0656,0,0,0,0,0,0.024,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.045,0,0,0,0,0,0,0.029,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1524,0.2,0.2,0.2386,0.3395,0.4,0.437,0.5,0.5287,0.6225,0.7,0.7063,0.7962,0.8,0.8941,0.9,0.9863,1,1.0729,1.1,1.1544,1.2,1.2504,1.3,1.3,1.3,1.3,1.3163,1.4,1.4,1.4,1.4,1.4017,1.4846,1.5,1.5,1.5748,1.6,1.6,1.653,1.7,1.7,1.7487,1.8,1.8341,1.9,1.9,1.9229,2,2,2,2.1,2.1,2.1897,2.2,2.2,2.2674,2.3,2.3,2.3567,2.4,2.4,2.4446,2.5,2.5262,2.6,2.6234,2.7149,2.8,2.8038,2.9011,2.9969,3.0913,3.1845,3.2762,3.3757,3.4649,3.5617,3.657,3.751,3.8,3.8432,3.9332,4,4,4,4.0121,4.1,4.1,4.1,4.0079,4,4,4,4,3.9334,3.9,3.9,3.9,3.8541,3.8,3.8,3.768,3.7,3.6761,3.6,3.6,3.5927,3.5,3.5,3.5,3.5,3.5,3.5761,3.6,3.6,3.6604,3.7,3.7514,3.8,3.8,3.8349,3.9,3.9218,4.0199,4.1123,4.2076,4.3016,4.3985,4.6816,5.0515,5.4222,5.8036,6.1097,6.4656,6.8461,7.3316,7.9083,8.4305,8.9369,9.5105,10.0759,10.6024,11.0027,11.4847,12.0482,12.5152,12.8994,13.2776,13.7381,14.1303,14.5168,14.8858,15.273,15.6547,15.9731,16.2596,16.542,16.7857,17.0111,17.2325,17.3532,17.522,17.6,17.6,17.6,17.6,17.5044,17.41,17.3145,17.2205,17.1255,17.0318,16.9373,16.784,16.6459,16.4536,16.2578,16.1234,15.967,15.8736,15.7552,15.566,15.3879,15.2881,15.0958,14.9064,14.8099,14.6287,14.5201,14.3477,14.2307,14.0709,13.9399,13.7916,13.6514,13.5552,13.4604,13.367,13.2718,13.1766,13.0812,12.9743,12.7916,12.6975,12.602,12.5078,12.3247,12.0547,11.7686,11.4154,11.1009,10.9385,10.7344,10.3998,10.0163,9.6382,9.2957,8.9799,8.6248,8.3404,8.0424,7.674,7.3851,7.0061,6.5307,6.1484,5.7696,5.4662,5.1084,4.7302,4.3498,3.971,3.6455,3.4075,3.1343,2.7917,2.5376,2.3484,2.1585,1.9849,1.9107,2,2,2,2.0894,2.1844,2.2787,2.374,2.6057,2.8265,3.0161,3.2057,3.3954,3.5851,3.8122,4.0967,4.354,4.5651,4.8509,5.1459,5.5259,5.9041,6.1881,6.5643,6.8561,7.1418,7.4251,7.7093,8.0593,8.3192,8.4541,8.5493,8.6437,8.7,8.7336,8.8,8.8,8.8,8.8,8.7926,8.7,8.7,8.6079,8.5133,8.5,8.4237,8.1863,7.968,7.7786,7.4219,6.948,6.4299,5.8212,5.1563,4.4634,3.7042,2.8897,1.9005,1.2368,0.5651,-0.2856,-0.8593,-2.9].map(v=>v-7);

function init_normalize(fv) { // Interpolate values for find_offset
    let par = [], ff = [];
    par.free_field = ff;
    const p = iso223_params;
    let i = 0;
    fv.forEach(function (f) {
        if (f >= p.f[i]) { i++; }
        let i0 = Math.max(0,i-1),
            i1 = Math.min(i,p.f.length-1),
            g;
        if (i0===i1) {
            g = n => p[n][i0];
        } else {
            let ll= [p.f[i0],p.f[i1],f].map(x=>Math.log(x)),
                l = (ll[2]-ll[0])/(ll[1]-ll[0]);
            g = n => { let v=p[n]; return v[i0]+l*(v[i1]-v[i0]); };
        }
        let a = g("a_f"),
            m = a * (Math.log10(4)-10 + g("L_U")/10),
            k = (0.005076/Math.pow(10,m)) - Math.pow(10, a*g("T_f")/10),
            c = Math.pow(10, 9.4 + 4*m) / fv.length;
        par.push({a:a, k:k, c:c});
        ffi = Math.floor(0.5+48*Math.log2(f/19.4806));
        ff.push(free_field[Math.max(0,Math.min(479,ffi))]);
    });
    return par;
}

// Find the appropriate offset (in dB) for fr so that the total loudness
// is equal to target (in phon)
let norm_par = []; // Cached interpolated ISO parameters
function find_offset(c, target) {
    let par;
    if (c.length!==f_values.length) {
        par = init_normalize(c.map(d=>d[0]));
    } else {
        if (!norm_par.length) { norm_par = init_normalize(f_values); }
        par = norm_par;
    }
    let fr = c.map(v=>v[1]);
    let x = 0; // Initial offset
    function getStep(o) {
        const l10 = Math.log(10)/10;
        let v=0, d=0;
        par.forEach(function (p,i) {
            let a=p.a, k=p.k, c=p.c, ds,v0,v1;
            v0  = Math.exp(l10*(fr[i]+o-par.free_field[i]));
            ds  = l10 * v0;
            v1  = k + Math.pow(v0,a);
            ds *= a * Math.pow(v0,a-1);
            v  += c * Math.pow(v1,4);
            ds *= c * 4 * Math.pow(v1,3);
            d  += ds;
        });
        // value: Math.log(v)/l10
        // deriv: d / (l10*v)
        return (Math.log(v) - target*l10) * (v/d);
    }
    let dx;
    do {
        dx = getStep(x);
        x -= dx;
    } while (Math.abs(dx) > 0.01);
    return x;
}


// File loading and channel management
const LR = typeof default_channels !== "undefined" ? default_channels
                                                   : ["L","R"];
let getO = i => LR.length>1 ? -1+i*2/(LR.length-1) : 0;
const sampnums = typeof num_samples !== "undefined" ? d3.range(1,num_samples+1)
                                                    : [""];
function loadFiles(p, callback) {
    let gen = (p._lfGen = (p._lfGen||0) + 1);
    let fetchTxt = base => d3.text(DIR+base+".txt").catch(()=>null);
    let parseFr = f => {
        if (!f) return null;
        try { return Equalizer.interp(f_values, tsvParse(f)); }
        catch (e) { return null; }
    };
    let f = p.isTarget ? [fetchTxt(p.fileName)]
          : d3.merge(LR.map(s =>
                sampnums.map(n => fetchTxt(p.fileName+" "+s+n))));
    let nSamp = sampnums.length;

    if (!p.isTarget && nSamp > 1) {
        let s1 = d3.range(LR.length).map(i => i * nSamp);
        let early = false;

        Promise.all(s1.map(i => f[i])).then(function (res) {
            if (gen !== p._lfGen) return;
            if (!res.some(x => x !== null)) return;
            early = true;
            let ch = new Array(LR.length * nSamp).fill(null);
            s1.forEach((idx, j) => { ch[idx] = parseFr(res[j]); });
            callback(ch);
        });

        Promise.all(f).then(function (frs) {
            if (gen !== p._lfGen) return;
            if (!frs.some(x => x !== null)) return;
            let ch = frs.map(parseFr);
            if (!early) { callback(ch); return; }
            let hasNew = ch.some((c, i) =>
                c !== null && (!p.rawChannels || p.rawChannels[i] === null));
            if (!hasNew || !p.rawChannels) return;
            p.rawChannels = ch;
            p.smooth = undefined;
            if (p.vars) p.vars[p.fileName] = ch;
            smoothPhone(p);
            normalizePhone(p);
            updatePaths();
            updatePhoneTable();
        });
        return;
    }

    Promise.all(f).then(function (frs) {
        if (gen !== p._lfGen) return;
        if (!frs.some(f=>f!==null)) return;
        let ch = frs.map(parseFr);
        callback(ch);
    });
}
let validChannels = p => (p.channels || []).filter(c=>c!==null);
let firstPresentChannel = chs => chs && chs.find(c => c != null);
let numChannels = p => p.channels ? d3.sum(p.channels, c=>c!==null) : 0;
let notMultichannel = LR.length===1 ? p=>true : p=>p.isTarget;
let hasChannelSel = p => !notMultichannel(p) && numChannels(p)>1;
let keyExt = LR.length===1 ? 16 : 0;
let keyLeft= keyExt ? 0 : sampnums.length>1 ? 11 : 0;
if (keyLeft) d3.select(".key").style("width","17%")

function avgCurves(curves) {
    if (!curves.length) return null;
    if (curves.length === 1) return curves[0];
    return curves
        .map(c=>c.map(d=>Math.pow(10,d[1]/20)))
        .reduce((as,bs) => as.map((a,i) => a+bs[i]))
        .map((x,i) => [curves[0][i][0], 20*Math.log10(x/curves.length)]);
}
function getAvg(p) {
    if (p.avg) {
        return p.activeCurves && p.activeCurves[0] ? p.activeCurves[0].l : null;
    }
    let v = validChannels(p);
    if (!v.length) return null;
    return v.length===1 ? v[0] : avgCurves(v);
}
function hasImbalance(p) {
    if (!p.channels || !hasChannelSel(p)) return false;
    let nSide = sampnums.length;
    let as = p.channels[0], bs = LR.length > 1 ? p.channels[nSide] : p.channels[1];
    if (!as || !bs) return false;
    let s0=0, s1=0;
    return as.some((a,i) => {
        let d = a[1]-bs[i][1];
        d *= 1/(50 * Math.sqrt(1+Math.pow(a[0]/1e4,6)));
        s0 = Math.max(s0+d,0);
        s1 = Math.max(s1-d,0);
        return Math.max(s0,s1) > max_channel_imbalance;
    });
}

let activePhones = [];
/** Maps init / share `fileName` to ordinal so `activePhones` matches init order after async loads. */
let initPhoneOrderIndex = new Map();
function setInitPhoneOrderFromReq(req) {
    initPhoneOrderIndex.clear();
    if (!req || !Array.isArray(req)) {
        return;
    }
    req.forEach((name, i) => {
        let k = String(name || "").trim();
        if (k && !initPhoneOrderIndex.has(k)) {
            initPhoneOrderIndex.set(k, i);
        }
    });
}
function initOrderRankForPhone(p) {
    if (!p) {
        return null;
    }
    let fn = String(p.fileName || "").trim();
    if (initPhoneOrderIndex.has(fn)) {
        return initPhoneOrderIndex.get(fn);
    }
    if (p.copyOf) {
        let root = p.copyOf,
            pf = String(root.fileName || "").trim();
        if (initPhoneOrderIndex.has(pf)) {
            let base = initPhoneOrderIndex.get(pf),
                objs = root.objs || [root],
                j = objs.indexOf(p);
            if (j < 0) {
                j = objs.length;
            }
            return base + j * 1e-4;
        }
    }
    return null;
}
function reorderActivePhonesByInitOrder() {
    if (!initPhoneOrderIndex.size) {
        return;
    }
    let orig = new Map();
    activePhones.forEach((q, i) => orig.set(q, i));
    activePhones.sort((a, b) => {
        let ra = initOrderRankForPhone(a),
            rb = initOrderRankForPhone(b);
        if (ra == null) {
            ra = 1e6 + orig.get(a) * 1e-6;
        }
        if (rb == null) {
            rb = 1e6 + orig.get(b) * 1e-6;
        }
        if (ra !== rb) {
            return ra - rb;
        }
        return orig.get(a) - orig.get(b);
    });
}
/** Targets first, then non-targets; relative order preserved within each group (table + graph). */
function phonesClusteredTargetsFirst(list) {
    return list.filter((p) => p && p.isTarget).concat(list.filter((p) => p && !p.isTarget));
}
/** Curve draw order: targets first in DOM so they paint under IEM traces (SVG paint = document order). */
function curvesTargetsFirstForPaint(curves) {
    let t = [],
        o = [];
    (curves || []).forEach((c) => {
        if (c && c.p && c.p.isTarget) {
            t.push(c);
        } else {
            o.push(c);
        }
    });
    return t.concat(o);
}
/** IEMs first (for pointer hit-tests so ties pick the measurement over a target). */
function curvesPhonesFirstForPointer(curves) {
    let t = [],
        o = [];
    (curves || []).forEach((c) => {
        if (c && c.p && c.p.isTarget) {
            t.push(c);
        } else {
            o.push(c);
        }
    });
    return o.concat(t);
}
function clusterTargetsFirstInActivePhones() {
    let next = phonesClusteredTargetsFirst(activePhones);
    activePhones.length = 0;
    activePhones.push(...next);
}
let phoneManageIdentityMap = new WeakMap(),
    phoneManageIdentitySeq = 1;
function phoneManageIdentity(p) {
    if (p == null) return 0;
    let v = phoneManageIdentityMap.get(p);
    if (v == null) {
        v = phoneManageIdentitySeq++;
        phoneManageIdentityMap.set(p, v);
    }
    return v;
}
let baseline0 = { p:null, l:null, fn:l=>l },
    baseline = baseline0;

/* EQ graph markers + FR curve strokes. Marker UNSEL_/SEL_* fill/stroke: "trace", "graph", or CSS. */
const EQ_GRAPH_MARKER_HIT_PX = 28;
const EQ_GRAPH_MARKER_R_BASE = 2.5;
const EQ_GRAPH_MARKER_UNSEL_SCALE = 1;
const EQ_GRAPH_MARKER_UNSEL_STROKE = "trace";
const EQ_GRAPH_MARKER_UNSEL_FILL = "graph";
const EQ_GRAPH_MARKER_UNSEL_HOVER_SCALE = 1;
const EQ_GRAPH_MARKER_SEL_SCALE = 1.8;
const EQ_GRAPH_MARKER_SEL_STROKE = "graph";
const EQ_GRAPH_MARKER_SEL_FILL = "trace";
const EQ_GRAPH_MARKER_SEL_HOVER_SCALE = 1.2;
const EQ_GRAPH_MARKER_STROKE_W = 4;
const EQ_GRAPH_MARKER_STROKE_HOVER_MULT = 2;
/** Base stroke width in SVG user units (sample vs main traces). Not overridden by CSS when scoped in style.css. */
const EQ_GRAPH_TRACE_STROKE_SAMPLE = 1.9;
const EQ_GRAPH_TRACE_STROKE_NORMAL = 2.3;
const EQ_GRAPH_TRACE_STROKE_EMPH_MULT = 2;

/** Baseline compensation targets (*Comp Target / *.txt); hidden from graph by default; omitted from EQ target picks. */
function isCompensationTargetNameMatch(p) {
    if (!p) {
        return false;
    }
    let fn = String(p.fileName || "").trim(),
        full = String(p.fullName || "").trim(),
        re = /comp target(\.txt)?$/i;
    return re.test(fn) || re.test(full);
}

/** Dash + stroke width per slot. `w` is the target trace stroke width in SVG user units (absolute, not added to NORMAL/SAMPLE). */
const TARGET_TRACE_DOT_SPECS = [
    { dash: "6 3", w: 2.8, cap: "butt" },
    { dash: "18 9", w: 1.25, cap: "round" },
    { dash: "2 6", w: 1.45, cap: "round" },
    { dash: "2 3", w: 1.55, cap: "round" },
    { dash: "6 4", w: 1.75, cap: "round" },
    { dash: "10 5", w: 1.3, cap: "round" },
    { dash: "14 4 2 4", w: 1.65, cap: "round" },
    { dash: "1 5", w: 1.95, cap: "round" },
    { dash: "8 3 2 3", w: 1.4, cap: "round" },
    { dash: "4 2 1 2 8 2", w: 1.7, cap: "round" },
];
/** Dash styles follow list position: 1st non–comp-target in `activePhones` = slot 0, 2nd = slot 1, … */
function refreshTargetStyleSlots() {
    activePhones.forEach((q) => {
        if (q && q.isTarget) {
            delete q._targetStyleSlotCache;
        }
    });
    let n = 0;
    activePhones.forEach((q) => {
        if (q && q.isTarget && !isCompensationTargetNameMatch(q)) {
            q._targetStyleSlotCache = n++;
        }
    });
    activePhones.forEach((q) => {
        if (q && q.isTarget && isCompensationTargetNameMatch(q)) {
            q._targetStyleSlotCache = 0;
        }
    });
}
/** Graph-only stroke fade for 2nd+ targets (table/key colors unchanged). Tweak here to taste. */
const TARGET_TRACE_OPACITY_SECOND = 0.52;
const TARGET_TRACE_OPACITY_REST = 0.38;
function graphPathOpacityForCurve(c) {
    if (!c || !c.p) {
        return null;
    }
    if (c.p.hide) {
        return 0;
    }
    if (!c.p.isTarget) {
        return null;
    }
    let slot = c.p._targetStyleSlotCache;
    if (!Number.isFinite(slot) || slot <= 0) {
        return null;
    }
    if (slot === 1) {
        return TARGET_TRACE_OPACITY_SECOND;
    }
    return TARGET_TRACE_OPACITY_REST;
}
function targetTraceDotSpecSlotForPhone(phone) {
    if (!phone || !phone.isTarget) {
        return 0;
    }
    if (phone._targetStyleSlotCache != null && Number.isFinite(phone._targetStyleSlotCache)) {
        return phone._targetStyleSlotCache;
    }
    return 0;
}
function targetTraceDotSpecForPhone(phone) {
    if (!phone) {
        return TARGET_TRACE_DOT_SPECS[0];
    }
    let slot = targetTraceDotSpecSlotForPhone(phone);
    return TARGET_TRACE_DOT_SPECS[slot % TARGET_TRACE_DOT_SPECS.length];
}
function targetTraceStrokeWidthFromSpec(spec) {
    let w = spec && typeof spec.w === "number" && Number.isFinite(spec.w)
        ? spec.w
        : TARGET_TRACE_DOT_SPECS[0].w;
    return Math.max(0.02, w);
}
function targetTraceStrokeWidthForPhone(phone) {
    return targetTraceStrokeWidthFromSpec(targetTraceDotSpecForPhone(phone));
}
function applyTargetCurveStrokePattern(pathSel, phone) {
    let spec = targetTraceDotSpecForPhone(phone);
    let cap = spec.cap || "round";
    pathSel
        .style("stroke-dasharray", spec.dash)
        .attr("stroke-linecap", cap)
        .attr("stroke-linejoin", cap === "round" ? "round" : "miter");
}
function clearNonTargetCurveStrokePattern(pathSel) {
    pathSel
        .style("stroke-dasharray", null)
        .attr("stroke-linecap", null)
        .attr("stroke-linejoin", null);
}

let gpath = gr.insert("g",".dBScaler")
    .attr("fill","none")
    .attr("stroke-width", EQ_GRAPH_TRACE_STROKE_NORMAL)
    .attr("class", "curves-g")
    .attr("mask","url(#graphFade)");
function eqMarkerResolvePaint(spec, traceCol) {
    if (spec === "trace") {
        /* d3 / browser color parsing may call .match on strings; null/empty breaks updates. */
        if (traceCol != null && traceCol !== "" && traceCol !== "none") {
            return traceCol;
        }
        return "#888888";
    }
    if (spec === "graph") {
        return "var(--background-color-graph)";
    }
    return spec;
}
/** Named d3 transition for EQ trace emphasis only (do not interrupt path "d" tweens). */
const EQ_GRAPH_TRACE_EM_TNAME = "eq-trace-em";
/** After updatePaths join, paths must carry explicit stroke-width; inherited + d3.attr tween
    from missing attribute can interpolate from 0 → hairline traces after Q/EQ updates. */
function resetGraphPathStrokesToBase() {
    gpath.selectAll("path").each(function () {
        let n = d3.select(this);
        n.interrupt(EQ_GRAPH_TRACE_EM_TNAME);
        let c = n.datum();
        let base = this.classList.contains("sample")
            ? EQ_GRAPH_TRACE_STROKE_SAMPLE
            : EQ_GRAPH_TRACE_STROKE_NORMAL;
        let sw = (c && c.p && c.p.isTarget) ? targetTraceStrokeWidthForPhone(c.p) : base;
        n.attr("stroke-width", sw);
    });
}
let gEqFilterMarkers = gr.append("g")
    .attr("class", "eq-filter-markers")
    .attr("pointer-events", "none")
    .attr("mask", "url(#graphFade)");
let gEqHoverPreview = gr.append("g")
    .attr("class", "eq-hover-preview")
    .attr("pointer-events", "none")
    .attr("mask", "url(#graphFade)");
let gEqSoundRangeBrush = gr.insert("g", ".eq-hover-preview")
    .attr("class", "eq-sound-range-brush")
    .attr("pointer-events", "none")
    .attr("mask", "url(#graphFade)");
/** Set in addExtra: redraw Sound Tools range band on graph after zoom / input changes. */
let eqSoundRangeUiHooks = { syncBrushFromInputs: () => {} };
let updateEqFilterMarkers = () => {};
let updateEqTraceOpacity = () => {};
/** When Parametric EQ tab is active, dims all graph traces except model / EQ / target (see addExtra). */
let applyParametricEqGraphTraceFocus = () => {};
/** @type {d3.Selection|null} */
let graphPlotHitRect = null;
/** Equalizer-tab graph: pointer gesture for add + vertical gain drag */
let eqGraphPointerState = null;
/** Last viewport client position over the graph (mousemove / drag); used to re-apply EQ hover
    after updateEqFilterMarkers(), e.g. when focusin on a filter field runs in a later frame. */
let lastGraphPlotPointerClient = null;
let eqGraphSkipNextClick = false;
/** After touch on the plot, browsers emit a synthetic click; skip click-to-add so EQ graph edits are mouse-only. */
let eqGraphSuppressClickAddFromTouch = false;
let eqGraphTouchSuppressClearTimer = null;
let eqGraphSkipClickClearTimer = null;
let eqGraphApplyEqDragTimer = null;
/** Saved inline styles while EQ graph drag disables text/image selection (Safari + trackpad). */
let eqGraphDragSelectSaved = null;
function eqGraphDragSelectBlock(ev) {
    ev.preventDefault();
}
function eqGraphInstallDragSelectLock() {
    if (eqGraphDragSelectSaved !== null) {
        eqGraphRemoveDragSelectLock();
    }
    let de = document.documentElement;
    let b = document.body;
    eqGraphDragSelectSaved = {
        deUser: de.style.userSelect,
        deWebkit: de.style.webkitUserSelect || "",
        bUser: b.style.userSelect,
        bWebkit: b.style.webkitUserSelect || "",
    };
    de.style.userSelect = "none";
    de.style.webkitUserSelect = "none";
    b.style.userSelect = "none";
    b.style.webkitUserSelect = "none";
    document.addEventListener("selectstart", eqGraphDragSelectBlock, true);
    document.addEventListener("dragstart", eqGraphDragSelectBlock, true);
    let sel = typeof window.getSelection === "function" ? window.getSelection() : null;
    if (sel && sel.rangeCount > 0) {
        sel.removeAllRanges();
    }
}
function eqGraphRemoveDragSelectLock() {
    if (eqGraphDragSelectSaved === null) {
        return;
    }
    let s = eqGraphDragSelectSaved;
    eqGraphDragSelectSaved = null;
    let de = document.documentElement;
    let b = document.body;
    de.style.userSelect = s.deUser;
    de.style.webkitUserSelect = s.deWebkit;
    b.style.userSelect = s.bUser;
    b.style.webkitUserSelect = s.bWebkit;
    document.removeEventListener("selectstart", eqGraphDragSelectBlock, true);
    document.removeEventListener("dragstart", eqGraphDragSelectBlock, true);
}
/** @type {(m: number[]) => boolean} */
let tryEqGraphClickAddFilter = (_m) => false;
/** @type {(m: number[] | null) => void} */
let syncEqHoverPreview = (m) => {
    if (!m && graphPlotHitRect && graphPlotHitRect.node()) {
        graphPlotHitRect.node().style.cursor = "";
    }
};
let gSpectrum = gr.insert("g", ".curves-g")
    .attr("class", "music-spectrum-viz")
    .attr("pointer-events", "none")
    .attr("transform", "translate(" + pad.l + "," + pad.t + ")")
    .attr("clip-path", "url(#spectrum-clip-inner)");
let musicSpectrumPathSel = gSpectrum.append("path")
    .attr("class", "music-spectrum-fill");
let musicSpectrumViz = {
    analyser: null,
    context: null,
    floatBuffer: null,
    rafId: null,
    pathSel: musicSpectrumPathSel,
    isActive: () => false,
    syncSpectrumViz: () => {},
    ensureBuffer: function () {
        if (!this.analyser) {
            return;
        }
        let n = this.analyser.frequencyBinCount;
        if (!this.floatBuffer || this.floatBuffer.length !== n) {
            this.floatBuffer = new Float32Array(n);
        }
    },
    stop: function () {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        if (this.pathSel) {
            this.pathSel.attr("d", "");
        }
    },
    tick: function () {
        let self = musicSpectrumViz;
        self.rafId = null;
        if (!self.analyser || !self.floatBuffer || !self.pathSel || !self.context || !self.isActive()) {
            if (self.pathSel) {
                self.pathSel.attr("d", "");
            }
            return;
        }
        self.analyser.getFloatFrequencyData(self.floatBuffer);
        self.pathSel.attr("d", buildMusicSpectrumPath(self.floatBuffer));
        self.rafId = requestAnimationFrame(() => self.tick());
    },
    start: function () {
        if (!this.analyser || !this.pathSel) {
            return;
        }
        this.stop();
        this.rafId = requestAnimationFrame(() => this.tick());
    }
};
/* gamma < 1: fewer polyline vertices in the lowest decades so the fill does not trace FFT
   leakage point-by-point (looks too gradual on a log frequency axis). */
let spectrumPathLogSampleGamma = 0.63;
function buildMusicSpectrumPath(floatFreq) {
    let ctx = musicSpectrumViz.context;
    if (!ctx || !floatFreq || !floatFreq.length) {
        return "";
    }
    let sr = ctx.sampleRate;
    let nyquist = sr / 2;
    let binCount = floatFreq.length;
    let hzPerBin = nyquist / binCount;
    let magAtHz = (f) => {
        if (f <= 0) {
            f = 1;
        }
        let idx = f / hzPerBin;
        let i0 = Math.floor(idx);
        let i1 = Math.min(i0 + 1, binCount - 1);
        let t = idx - i0;
        return floatFreq[i0] * (1 - t) + floatFreq[i1] * t;
    };
    let x0 = x.domain()[0];
    let x1 = Math.min(x.domain()[1], nyquist * 0.995);
    if (x1 <= x0 * 1.02) {
        return "";
    }
    let nPoints = 128;
    let yBottomLocal = H;
    let d0 = y.domain()[0];
    let d1 = y.domain()[1];
    let dbs = [];
    let freqs = [];
    for (let i = 0; i <= nPoints; i++) {
        let u = i / nPoints;
        let uEff = u <= 0 ? 0 : Math.pow(u, spectrumPathLogSampleGamma);
        let f = x0 * Math.pow(x1 / x0, uEff);
        freqs.push(f);
        dbs.push(magAtHz(f));
    }
    let hi = -Infinity;
    let lo = Infinity;
    for (let j = 0; j < dbs.length; j++) {
        let v = dbs[j];
        if (Number.isFinite(v)) {
            hi = Math.max(hi, v);
            lo = Math.min(lo, v);
        }
    }
    if (!Number.isFinite(hi) || !Number.isFinite(lo)) {
        return "";
    }
    let minSpanDb = 42;
    let spanDb = Math.max(minSpanDb, hi - lo);
    let baseDb = hi - spanDb;
    let pts = [];
    for (let i = 0; i <= nPoints; i++) {
        let n = (dbs[i] - baseDb) / spanDb;
        n = Math.max(0, Math.min(1, n));
        let spl = d0 + n * (d1 - d0) * 0.92;
        pts.push([x(freqs[i]) - pad.l, y(spl) - pad.t]);
    }
    let d = "M" + pts[0][0] + "," + yBottomLocal;
    pts.forEach((p) => {
        d += " L" + p[0] + "," + p[1];
    });
    d += " L" + pts[pts.length - 1][0] + "," + yBottomLocal + " Z";
    return d;
}
function hl(p, h, sub) {
    gpath.selectAll("path").filter(c => {
        if (c.p !== p) return false;
        if (sub === undefined || sub === null) return true;
        return c === p.activeCurves[sub];
    }).classed("highlight", h);
}
let table = doc.select(".curves");

let ld_p1 = 1.1673039782614187;
function getCurveColor(id, o) {
    let p1 = ld_p1,
        p2 = p1*p1,
        p3 = p2*p1;
    let t = o/32;
    let i=id/p3+0.76, j=id/p2+0.79, k=id/p1+0.32;
    if (id < 0) { return d3.hcl(360*(1-(-i)%1),5,66); } // Target
    let th = 2*Math.PI*i;
    i += Math.cos(th-0.3)/24 + Math.cos(6*th)/32;
    let s = Math.sin(2*Math.PI*i);
    return d3.hcl(360*((i + t/p2)%1),
                  88+30*(j%1 + 1.3*s - t/p3),
                  36+22*(k%1 + 1.1*s + 6*t*(1-s)));
}
let getColor_AC = c => getCurveColor(c.p.id, c.o);
let getColor_ph = (p,i) => getCurveColor(p.id, p.activeCurves[i].o);
function getDivColor(id, active) {
    let c = getCurveColor(id,0);
    c.l = 100-(80-Math.min(c.l,60))/(active?1.5:3);
    c.c = (c.c-20)/(active?3:4);
    return c;
}
function color_curveToText(c) {
    return c;
}
let getTooltipColor = curve => color_curveToText(getColor_AC(curve));
let getTextColor = p => color_curveToText(getCurveColor(p.id,0));
let getBgColor = p => {
    let c=getCurveColor(p.id,0).rgb();
    ['r','g','b'].forEach(p=>c[p]=255-(255-Math.max(0,c[p]))*0.85);
    return c;
}

let cantCompare;
let noTargets = typeof disallow_target !== "undefined" && disallow_target;
if (noTargets || typeof max_compare !== "undefined") {
    const currency = [
        ["$", "#348542"],
        ["¥", "#d11111"],
        ["€", "#2961d4"],
        ["฿", "#dcaf1d"]
    ];
    let currencyCounter = -1,
        lastMessage = null,
        messageWeight = 0;
    let cantTarget = p => false;
    if (noTargets) {
        if (typeof allow_targets === "undefined") {
            cantTarget = p => p.isTarget;
        } else {
            let r = f => f.replace(/ Target$/,""),
                a = allow_targets.map(r);
            cantTarget = p => p.isTarget && a.indexOf(r(p.fileName))<0;
        }
    }
    let ct = typeof restrict_target === "undefined" || restrict_target,
        ccfilter = ct ? (l => l) : (l => l.filter(p=>!p.isTarget));
    cantCompare = function(ps, add, p, noMessage) {
        let count = ccfilter(ps).length + (add||0) - (!ct&&p&&p.isTarget?1:0);
        if (count<max_compare && !(p&&cantTarget(p))) { return false; }
        if (noMessage) { return true; }
        let div = doc.append("div");
        let c = currency[currencyCounter++ % currency.length];
        let lm = lastMessage;
        lastMessage = Date.now();
        messageWeight *= Math.pow(2, (lm?lm-lastMessage:0)/3e4); // 30-second half-life
        messageWeight++;
        if (!currencyCounter || messageWeight>=2) {
            messageWeight /= 2;
            let button = div.attr("class","cashMessage")
                .html(premium_html)
                .append("button").text("Fine")
                .on("mousedown", ()=>messageWeight=0);
            button.node().focus();
            let back = doc.append("div")
                .attr("class","fadeAll");
            [button,back].forEach(e =>
                e.on("click", ()=>[div,back].forEach(e=>e.remove()))
            );
        } else {
            div.attr("class","cash")
                .style("color",c[1]).text(c[0])
                .transition().duration(120).remove();
        }
        return true;
    }
} else {
    cantCompare = function(m) { return false; }
}

let phoneNumber = 0; // I'm so sorry it just happened
// Find a phone id which doesn't have a color conflict with pins
let nextPN = 0; // Cached value; invalidated when pinned headphones change
function nextPhoneNumber() {
    if (nextPN === null) {
        nextPN = phoneNumber;
        let pin = activePhones.filter(p => p.pin).map(p=>p.id);
        if (pin.length) {
            let p3 = ld_p1*ld_p1*ld_p1,
                l = a => b => Math.abs(((a-b)/p3 + 0.5) % 1 - 0.5),
                d = id => d3.min(pin, l(id));
            for (let i=nextPN, max=d(i); max<0.12 && ++i<phoneNumber+3; ) {
                let m = d(i);
                if (m > max) { max=m; nextPN=i; }
            }
        }
    }
    return nextPN;
}
function getPhoneNumber() {
    let pn = nextPhoneNumber();
    phoneNumber = pn + 1;
    nextPN = null;
    return pn;
}

function setPhoneTr(phtr) {
    phtr.each(function (p) {
        p.highlight = p.active;
        let o = p.objs; if (!o) return;
        p.objs = o = o.filter(q=>q.active);
        if (o.length === 0) {
            delete p.objs;
        } else if (!p.active) {
            p.id = o[0].id;
            p.highlight = true;
        }
    });
    phtr.style("background",p=>p.isTarget&&!p.active?null:getDivColor(p.id,p.highlight))
        .style("border-color",p=>p.highlight?getDivColor(p.id,1):null);
    phtr.filter(p=>!p.isTarget)
        .select(".phone-item-add")
        .selectAll(".remove").data(p=>p.highlight?[p]:[])
        .join("span").attr("class","remove").text("⊗")
        .on("click", p => { d3.event.stopPropagation(); removeCopies(p); });
}

let channelbox_x = c => c?-86:-36,
    channelbox_tr = c => "translate("+channelbox_x(c)+",0)";
function setCurves(p, avg, lr, samp) {
    if (!p.channels || !p.channels.length) {
        p.activeCurves = p.activeCurves || [];
        return;
    }
    if (avg ===undefined) avg = p.avg;
    if (samp===undefined) samp = avg ? false : LR.length===1||p.ssamp||false;
    else { p.ssamp = samp; if (samp) avg = false; }
    let dx = +avg - +p.avg,
        n  = LR.length ? p.channels.length / LR.length : p.channels.length,
        selCh = (l,i) => l.slice(i*n,(i+1)*n);
    p.avg = avg;
    p.samp = samp = n>1 && samp;
    if (!p.isTarget) {
        let id = getChannelName(p),
            v  = cs => cs.filter(c=>c!==null),
            cs = p.channels,
            cv = v(cs),
            mc = cv.length>1,
            pc = (idstr, l, oi) => ({id:id(idstr), l:l, p:p,
                                     o:oi===undefined?0:getO(oi)});
        p.activeCurves
            = avg && mc ? [pc("AVG", avgCurves(cv))]
            : !samp && mc ? LR.map((l,i) => pc(l, avgCurves(v(selCh(cs,i))), i)).filter(c => c.l)
            : cs.map((l,i) => {
                let j = Math.floor(i/n);
                return pc(LR[j]+sampnums[i%n], l, j);
            }).filter(c => c.l);
    } else {
        p.activeCurves = [{id:p.fullName, l:p.channels[0], p:p, o:0}];
    }
    let y = 0;
    let k = d3.selectAll(".keyLine").filter(q=>q===p);
    let ksb = k.select(".keySelBoth").attr("display","none");
    p.lr = lr;
    if (lr!==undefined) {
        p.activeCurves = p.samp ? selCh(p.activeCurves, lr) : [p.activeCurves[lr]];
        y = [-1,1][lr];
        ksb.attr("display",null).attr("y", [0,-12][lr]);
    }
    k.select(".keyMask")
        .transition().duration(400)
        .attr("x", channelbox_x(avg))
        .attrTween("y", function () {
            let y0 = +this.getAttribute("y"),
                y1 = 12*(-1+y);
            if (!dx) { return d3.interpolateNumber(y0,y1); }
            let ym = y0 + (y1-y0)*(3-2*dx)/6;
            y0-=ym; y1-=ym;
            return t => { t-=1/2; return ym+(t<0?y0:y1)*Math.pow(2,20*(Math.abs(t)-1/2)); };
        });
    k.select(".keySel").attr("transform", channelbox_tr(avg));
    k.selectAll(".keySamp").attr("opacity",(_,i)=>i===+samp?1:0.6);
}
function updateCurves() {
    setCurves.apply(null, arguments);
    updatePaths();
}

let drawLine = d => line(baseline.fn(d.l));
function redrawLine(p) {
    let getTr = o => o ? "translate(0,"+(y(o)-y(0))+")" : null;
    p.attr("transform", c => getTr(getOffset(c.p))).attr("d", drawLine);
}
function updateYCenter() {
    let c = yCenter;
    yCenter = baseline.p ? 0 : norm_sel ? 60 : norm_phon;
    y.domain(y.domain().map(d=>d+(yCenter-c)));
    yAxisObj.call(fmtY);
}
function setBaseline(b, no_transition) {
    baseline = b;
    updateYCenter();
    if (no_transition) {
        gpath.selectAll("path").attr("d", drawLine);
        updateEqFilterMarkers();
        return;
    }
    gpath.selectAll("path")
        .transition().duration(500).ease(d3.easeQuad)
        .attr("d", drawLine)
        .on("end", () => updateEqFilterMarkers());
    table.selectAll("tr").select(".button-baseline")
        .classed("selected", d => d.p === baseline.p);
    
    // Analytics event
    if (analyticsEnabled && b.p) { pushPhoneTag("baseline_set", b.p); }
}
function getBaseline(p) {
    let b = getAvg(p).map(d => d[1]+getOffset(p));
    return { p:p, fn:l=>l.map((e,i)=>[e[0],e[1]-b[Math.min(i,b.length-1)]]) };
}

function setOffset(p, o) {
    p.offset = +o;
    if (baseline.p === p) { baseline = getBaseline(p); }
    updatePaths();
}
let getOffset = p => p.offset + p.norm;

function setHover(elt, h) {
    elt.on("mouseover", h(true)).on("mouseout", h(false));
}

// See if iframe gets CORS error when interacting with window.top
try {
    let emb = window.location.href.includes('embed');
    
    accessWindowTop = (window.top.location.href) ? true:false;
    targetWindow = emb ? window : window.top;
} catch {
    accessWindowTop = false;
    targetWindow = window;
}

// See if iframe gets CORS error when interacting with window.top.document
try {
    accessDocumentTop = (window.top.document) ? true:false;
} catch {
    accessDocumentTop = false;
}

let ifURL = typeof share_url !== "undefined" && share_url;
let baseTitle = typeof page_title !== "undefined" ? page_title : "CrinGraph";
let baseDescription = typeof page_description !== "undefined" ? page_description : "View and compare frequency response graphs";
let baseURL;  // Set by setInitPhones
function addPhonesToUrl() {
    let title = baseTitle,
        url = baseURL,
        names = activePhones.filter(p => !p.isDynamic).map(p => p.fileName),
        namesCombined = names.join(", ");
    
    if (names.length) {
        url += "?share=" + encodeURI(names.join().replace(/ /g,"_"));
        title = namesCombined + " - " + title;
    }
    if (names.length === 1) {
        targetWindow.document.querySelector("link[rel='canonical']").setAttribute("href",url)
    } else {
        targetWindow.document.querySelector("link[rel='canonical']").setAttribute("href",baseURL)
    }
    targetWindow.history.replaceState("", title, url);
    targetWindow.document.title = title;
    targetWindow.document.querySelector("meta[name='description']").setAttribute("content",baseDescription + ", including " + namesCombined +".");
}

function setModeEmbed() {
    document.querySelector("body").setAttribute("embed-mode", "true");
}

/** Rejoin path elements to active curve data and redraw (no clearLabels / URL / sticky labels). */
function rebindGraphPathSelectionAndRedraw() {
    let c = curvesTargetsFirstForPaint(d3.merge(activePhones.map(p => p.activeCurves || []))),
        p = gpath.selectAll("path").data(c, d=>d.id);
    let joined = p.join("path").attr("opacity", (c) => graphPathOpacityForCurve(c) ?? (c.p.hide ? 0 : null))
        .classed("sample", c=>c.p.samp)
        .attr("stroke", getColor_AC).call(redrawLine);
    if (typeof joined.order === "function") {
        joined.order();
    }
    let t = joined.filter(c=>c.p.isTarget)
        .attr("data-phone-name", c=>c.p.fullName)
        .attr("class", "target");
    resetGraphPathStrokesToBase();
    gpath.selectAll("path").each(function (c) {
        let n = d3.select(this);
        if (!c || !c.p) {
            return;
        }
        if (c.p.isTarget) {
            applyTargetCurveStrokePattern(n, c.p);
        } else {
            clearNonTargetCurveStrokePattern(n);
        }
    });
    if (targetColorCustom) {
        t.attr("stroke", targetColorCustom);
    }
}

function updatePaths(trigger) {
    reorderActivePhonesByInitOrder();
    clusterTargetsFirstInActivePhones();
    refreshTargetStyleSlots();
    clearLabels();
    rebindGraphPathSelectionAndRedraw();
    if (ifURL && !trigger) addPhonesToUrl();
    if (stickyLabels) drawLabels();
    updateEqFilterMarkers();
    applyParametricEqGraphTraceFocus();
    updateEqTraceOpacity();
    eqSoundRangeUiHooks.syncBrushFromInputs();
}
let colorBar = p=>'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 8"><path d="M0 8v-8h1c0.05 1.5,-0.3 3,-0.16 5s0.1 2,0.15 3z" fill="'+getBgColor(p)+'"/></svg>\')';

function manageTableRows() {
    let curvesAll = d3.merge(activePhones.map(p => p.activeCurves || [])),
        phoneOrder = [],
        seenP = new Set();
    curvesAll.forEach(c => {
        if (!c || !c.p || seenP.has(c.p)) return;
        seenP.add(c.p);
        phoneOrder.push(c.p);
    });
    phoneOrder = phonesClusteredTargetsFirst(phoneOrder);
    let rows = [];
    phoneOrder.forEach(p => {
        let pid = phoneManageIdentity(p),
            ac = p.activeCurves || [];
        if (p.samp && ac.length > 1) {
            ac.forEach((curve, i) => {
                rows.push({
                    p, sub: i,
                    key: pid + "\t" + String(curve.id) + "\ts" + i
                });
            });
        } else {
            let cid = ac[0] ? String(ac[0].id) : String(p.fileName || p.dispName || "");
            rows.push({
                p, sub: null,
                key: pid + "\t" + cid + "\tm"
            });
        }
    });
    return rows;
}

function updatePhoneTable(trigger) {
    let rows = manageTableRows(),
        trJoin = table.selectAll("tr").data(rows, r => r.key);
    trJoin.exit().remove();

    function isManageMainRow(r) {
        return r.sub === null || r.sub === 0;
    }
    function removeRowClicked() {
        let r = d3.select(d3.event.currentTarget.closest("tr")).datum(),
            ac = r.p.activeCurves || [];
        if (r.p.samp && ac.length > 1 && typeof r.sub === "number" && r.sub > 0) {
            removeSampleRow(r.p, r.sub);
        } else {
            removePhone(r.p);
        }
    }

    let enter = trJoin.enter().append("tr")
        .attr("data-filename", r => r.p.fileName)
        .attr("data-phone-id", r => r.p.id)
        .attr("data-manage-main", r => isManageMainRow(r) ? "1" : null);

    let nRest = 7 + (exportableGraphs ? 1 : 0),
        subOnly = enter.filter(r => !isManageMainRow(r));
    subOnly.call(setHover, h => r => hl(r.p, h, r.sub))
        .style("color", r => getDivColor(r.p.id, true));
    subOnly.append("td").attr("class", "remove").text("⊗")
        .attr("title", "Remove this sample")
        .on("click", removeRowClicked)
        .style("background-image", r => colorBar(r.p))
        .filter(r => !r.p.isTarget).append("svg").call(addColorPicker);
    subOnly.append("td").attr("class", "manage-sample-row-label").attr("colspan", nRest)
        .append("span").attr("class", "manage-sample-label")
        .text(r => (r.p.activeCurves[r.sub] && r.p.activeCurves[r.sub].id) || "");

    let f = enter.filter(isManageMainRow),
        td = () => f.append("td");
    f.call(setHover, h => r => hl(r.p, h, r.sub))
        .style("color", r => getDivColor(r.p.id, true));

    td().attr("class", "remove").text("⊗")
        .attr("title", "Remove graph")
        .on("click", removeRowClicked)
        .style("background-image", colorBar)
        .filter(r => !r.p.isTarget).append("svg").call(addColorPicker);
    td().attr("class", "item-line item-target")
        .call(s => s.filter(r => !r.p.isTarget).attr("class", "item-line item-phone")
            .append("span").attr("class", "brand").text(r => r.p.dispBrand))
        .call(addModel);
    td().attr("class", "curve-color").append("button")
        .style("background-color", r => getCurveColor(r.p.id, 0))
        .filter(r => !r.p.isTarget).call(makeColorPicker);
    td().attr("class", "channels").append("svg").datum(r => r.p).call(addKey);
    td().attr("class", "levels").append("input")
        .attrs({ type: "number", step: "any", value: 0 })
        .property("value", r => r.p.offset)
        .on("change input", function (r) { setOffset(r.p, +this.value); });
    if (exportableGraphs) {
        td().attr("class", "button button-export")
            .attr("title", "Export graph")
            .on("click", function (r) {
                let phoneName = r.p.fullName,
                    channels = r.p.rawChannels,
                    exportContainer = document.querySelector("body");

                channels.forEach(function (channel, i) {
                    if (!channel) return;
                    let channelNum = i + 1,
                        text = channel.reduce((acc, c) => {
                            return acc.concat([Object.values(c).join("\t")]);
                        }, []).join("\n"),
                        blob = new Blob([text], { type: "text/plain" }),
                        url = URL.createObjectURL(blob),
                        exportLink = document.createElement("a");

                    exportLink.download = phoneName + " [" + channelNum + "]" + ".txt";
                    exportLink.href = url;
                    exportContainer.appendChild(exportLink);
                    exportLink.click();
                    exportLink.remove();
                });
            });
    }
    td().attr("class", "button button-baseline")
        .attr("title", "Set as baseline")
        .html("<svg viewBox='-170 -120 340 240'><use xlink:href='#baseline-icon'></use></svg>")
        .on("click", r => setBaseline(r.p === baseline.p ? baseline0
            : getBaseline(r.p)));
    function toggleHide(p) {
        let h = p.hide,
            t = table.selectAll("tr").filter(q => q.p === p && (q.sub === null || q.sub === 0));
        t.select(".keyLine").on("click", h ? null : toggleHide)
            .selectAll("path,.imbalance").attr("opacity", h ? null : 0.5);
        t.select(".hideIcon").classed("selected", !h);
        gpath.selectAll("path").filter(c => c.p === p)
            .attr("opacity", h ? null : 0);
        p.hide = !h;
        if (p.isTarget && isCompensationTargetNameMatch(p)) {
            p.compTargetUserToggledHide = true;
        }
        if (labelsShown) {
            clearLabels();
            drawLabels();
        }
    }
    td().attr("class", "button hideIcon")
        .attr("title", "Hide graph")
        .html("<svg viewBox='-2.5 0 19 12'><use xlink:href='#hide-icon'></use></svg>")
        .on("click", r => toggleHide(r.p));
    td().attr("class", "button button-pin")
        .attr("title", "Pin graph")
        .attr("data-pinned", "false")
        .html("<svg viewBox='-135 -100 270 200'><use xlink:href='#pin-icon'></use></svg>")
        .on("click", function (r) {
            if (cantCompare(activePhones.filter(p => p.pin), 1)) return;

            if (r.p.pin) {
                r.p.pin = false;
                this.setAttribute("data-pinned", "false");
            } else {
                r.p.pin = true; nextPN = null;
                this.setAttribute("data-pinned", "true");
            }

            r.p.pin = true; nextPN = null;
            d3.select(this)
                .text(null).classed("button", false).on("click", null)
                .insert("svg").attr("class", "pinMark")
                .attr("viewBox", "0 0 280 145")
                .insert("path").attrs({
                    fill: "none",
                    "stroke-width": 30,
                    "stroke-linecap": "round",
                    d: "M265 110V25q0 -10 -10 -10H105q-24 0 -48 20l-24 20q-24 20 -2 40l18 15q24 20 42 20h100"
                });
            if (!userConfigApplicationActive) setUserConfig();
        });

    enter.merge(trJoin).select(".manage-sample-label")
        .text(r => !isManageMainRow(r) && r.p.activeCurves[r.sub]
            ? r.p.activeCurves[r.sub].id : "");
}

function addKey(s) {
    let dim={x:-19-keyLeft, y:-12, width:65+keyLeft, height:24}
    s.attr("class","keyLine").attr("viewBox",[dim.x,dim.y,dim.width,dim.height].join(" "));
    let defs = s.append("defs");
    defs.append("linearGradient").attr("id", p=>"chgrad"+p.id)
        .attrs({x1:0,y1:0, x2:0,y2:1})
        .selectAll().data(p=>[0.1,0.4,0.6,0.9].map(o =>
            [o, getCurveColor(p.id, o<0.3?-1:o<0.7?0:1)]
        )).join("stop")
        .attr("offset",i=>i[0])
        .attr("stop-color",i=>i[1]);
    defs.append("linearGradient").attr("id","blgrad")
        .selectAll().data([0,0.25,0.31,0.69,0.75,1]).join("stop")
        .attr("offset",o=>o)
        .attr("stop-color",(o,i) => i==2||i==3?"white":"#333");
    let m = defs.append("mask").attr("id",p=>"chmask"+p.id);
    m.append("rect").attrs(dim).attr("fill","#333");
    m.append("rect").attrs({"class":"keyMask", x:p=>channelbox_x(p.avg), y:-12, width:120, height:24, fill:"url(#blgrad)"});
    let t = s.append("g");
    t.append("path")
        .attr("stroke", p => notMultichannel(p) ? getCurveColor(p.id,0)
                                                : "url(#chgrad"+p.id+")");
    t.selectAll().data(p=>p.isTarget?[]:LR)
        .join("text").attr("class","keyCLabel")
        .attrs({x:17+keyExt, y:(_,i)=>12*(i-(LR.length-1)/2),
                dy:"0.32em", "text-anchor":"start", "font-size":10.5})
        .text(t=>t);
    t.filter(p=>p.isTarget).append("text")
        .attrs(keyExt?{x:7,y:6,"text-anchor":"middle"}
                     :{x:17,y:0,"text-anchor":"start"})
        .attrs({dy:"0.32em", "font-size":8, fill:p=>getCurveColor(p.id,0)})
        .text("Target");
    let uchl = f => function (p) {
        updateCurves(p, f(p)); hl(p,true);
    }
    s.append("rect").attr("class","keySelBoth")
        .attrs({x:40+channelbox_x(0), width:40, height:12,
                opacity:0, display:"none"})
        .on("click", uchl(p=>0));
    s.append("g").attr("class","keySel")
        .attr("transform",p=>channelbox_tr(p.avg))
        .on("click", uchl(p=>!p.avg))
        .selectAll().data([0,80]).join("rect")
        .attrs({x:d=>d, y:-12, width:40, height:24, opacity:0});
    let o = s.filter(p=>!notMultichannel(p))
        .selectAll().data(p=>[[p,0],[p,1]])
        .join("g").attr("class","keyOnly")
        .attr("transform",pi=>"translate(25,"+[-6,6][pi[1]]+")")
        .call(setHover, h => function (pi) {
            let p = pi[0], cs = p.activeCurves;
            if (!p.hide && cs.length===2) {
                d3.event.stopPropagation();
                hl(p, h ? (c=>c===cs[pi[1]]) : true);
                clearLabels();
                gpath.selectAll("path").filter(c=>c.p===p).attr("opacity",h ? (c=>c!==cs[pi[1]]?0.7:null) : null);
            }
        })
        .on("click", pi => updateCurves(pi[0], false, pi[1]));
    o.append("rect").attrs({x:0,y:-6,width:30,height:12,opacity:0});
    o.append("text").attrs({x:0, y:0, dy:"0.28em", "text-anchor":"start",
                            "font-size":7.5 })
        .text("only");
    s.append("text").attr("class","imbalance")
        .attrs({x:8,y:0,dy:"0.35em","font-size":10.5})
        .text("!");
    if (sampnums.length>1) {
        let a = s.filter(p=>!p.isTarget);
        let f = LR.length>1 ? (n=>"all "+n) : (n=>n+" samples");
        let t = a.selectAll()
            .data(p=>["AVG",f(Math.floor(validChannels(p).length/LR.length))]
                        .map((t,i)=>[t,i===+p.samp?1:0.6]))
            .join("text").attr("class","keySamp")
            .attrs({x:-18.5-keyLeft, y:(_,i)=>12*(i-1/2), dy:"0.33em",
                    "text-anchor":"start", "font-size":7, opacity:t=>t[1] })
            .text(t=>t[0]);
        a.append("rect")
            .attrs({x:-19-keyLeft, y:-12, width:keyLeft?16:38, height:24, opacity:0})
            .on("click", p=>updateCurves(p, undefined, p.lr, !p.samp));
    }
    updateKey(s);
}

function updateKey(s) {
    let disp = fn => e => e.attr("display",p=>fn(p)?null:"none"),
        cs = hasChannelSel;
    s.select(".imbalance").call(disp(hasImbalance));
    s.select(".keySel").call(disp(p=>cs(p)));
    s.selectAll(".keyOnly").call(disp(pi=>cs(pi[0])));
    s.selectAll(".keyCLabel").data(p => p.channels || []).call(disp(c=>c));
    s.select("g").attr("mask",p=>cs(p)?"url(#chmask"+p.id+")":null);
    let l=-17-(keyLeft?8:0);
    s.select("path").attr("d", p => {
        if (notMultichannel(p) || !p.channels) {
            return "M"+(15+keyExt)+" 0H"+l;
        }
        let segs = ["M15 -6H9C0 -6,0 0,-9 0H"+l,"M"+l+" 0H-9C0 0,0 6,9 6H15"]
            .filter((_,i) => p.channels[i ? sampnums.length : 0]);
        return segs.length ? segs.reduce((a,b) => a+b.slice(6)) : "M"+(15+keyExt)+" 0H"+l;
    });
}

function addModel(t) {
    let n = t.append("div").attr("class","phonename").text(r=>r.p.dispName);
    t.filter(r=>r.p.fileNames)
        .append("div").attr("class","variants")
        .call(function (s) {
            s.append("svg").attr("viewBox","0 -2 10 11")
                .append("path").attr("fill","currentColor")
                .attr("d","M1 2L5 6L9 2L8 1L6 3Q5 4 4 3L2 1Z");
        })
        .attr("tabindex",0) // Make focusable
        .on("focus", function (r) {
            let p = r.p;
            if (p.selectInProgress) return;
            p.selectInProgress = true;
            p._variantFocusStartFile = p.fileName;
            if (!p.vars) p.vars = {};
            p.vars[p.fileName] = p.rawChannels;
            d3.select(this)
                .on("mousedown", function () {
                    d3.event.preventDefault();
                    this.blur();
                })
                .select("path").attr("transform","translate(0,7)scale(1,-1)");
            let n = d3.select(this.parentElement).select(".phonename");
            n.text("");
            let q = p.copyOf || p,
                o = q.objs || [p],
                active_fns = o.map(v=>v.fileName),
                vars = p.fileNames.map((f,i) => {
                    let j = active_fns.indexOf(f);
                    return j!==-1 ? o[j] :
                        {fileName:f, dispName:q.dispNames[i]};
                });
            let nVariantNames = n.append("div").attr("class","variant-names");
            let nVariantPopouts = n.append("div").attr("class","variant-popouts");
            let d = nVariantNames.selectAll().data(vars).join("div")
                     .attr("class","variantName").text(v=>v.dispName),
                w = d3.max(d.nodes(), d=>d.getBoundingClientRect().width);
            d.style("width",w+"px");
            d.filter(v=>v.active)
                .style("cursor","initial")
                .style("color", getTextColor)
                .call(setHover, h => () =>
                    table.selectAll("tr").filter(row => row.p === r.p)
                        .classed("highlight", h)
                );
            let c = nVariantPopouts.selectAll().data(vars).join("span")
                .html("&nbsp;+&nbsp;").attr("class","variantPopout")
                .style("left",(w+5)+"px")
                .style("display",v=>v.active?"none":null);
            [d,c].forEach(e=>e.transition().style("top",(_,i)=>i*1.3+"em"));
            /* Do not Object.assign(p,v): v can be a full on-graph variant (copyOf, id, …) and would
               overwrite p.fileName etc., collapsing manage rows that key on fileName. */
            d.filter(v=>!v.active).on("mousedown", v => {
                p.fileName = v.fileName;
                p.dispName = v.dispName;
            });
            c.on("mousedown", function (v) {
                showVariant(q, v);
            });
        })
        .on("blur", function endSelect(r) {
            let p = r.p;
            if (document.activeElement === this) return;
            p.selectInProgress = false;
            d3.select(this)
                .on("mousedown", null)
                .select("path").attr("transform", null);
            let n = d3.select(this.parentElement).select(".phonename");
            n.selectAll("div")
                .call(setHover, h=>p=>null)
                .transition().style("top",0+"em").remove()
                .end().then(()=>n.text(()=>p.dispName));
            /* Avoid changeVariant when nothing changed: blur runs on every close (e.g. picking
               another model) and would re-smooth + full updatePhoneTable for no reason. */
            let startF = p._variantFocusStartFile;
            delete p._variantFocusStartFile;
            if (startF !== undefined && p.fileName !== startF) {
                changeVariant(p, updateVariant);
            } else {
                updateKey(table.selectAll("tr").filter(row => row.p === p && (row.sub === null || row.sub === 0)).select(".keyLine"));
            }
            table.selectAll("tr").classed("highlight", false); // Prevents some glitches
        });
    t.filter(r=>r.p.isTarget).append("span").text(" Target");
}

function updateVariant(p) {
    updateKey(table.selectAll("tr").filter(r => r.p === p && (r.sub === null || r.sub === 0)).select(".keyLine"));
    normalizePhone(p);
    updatePaths();
    updatePhoneTable();
    d3.selectAll("#phones .phone-item,.target")
        .filter(q => q.id !== undefined)
        .call(setPhoneTr);
    if (extraEnabled && extraEQEnabled && typeof window.updateEQPhoneSelect === "function") {
        window.updateEQPhoneSelect();
    }
}
function changeVariant(p, update, trigger) {
    if (!p.vars) p.vars = {};
    let fn = p.fileName,
        ch = p.vars[fn];
    function set(ch) {
        p.rawChannels = ch;
        p.smooth = undefined;
        p.vars[p.fileName] = ch;
        smoothPhone(p);
        /* setCurves already runs inside smoothPhone after rawChannels change */
        update(p, 0, 0, trigger);
    }
    if (ch) {
        set(ch);
    } else {
        loadFiles(p, set);
    }
}
function showVariant(p, c, trigger) {
    if (cantCompare(activePhones)) return;
    if (!p.objs) { p.objs = [p]; }
    if (c !== p) {
        delete c.objs;
    }
    p.objs.push(c);
    c.active=true; c.copyOf=p;
    ["brand","dispBrand","fileNames","vars","phone","fullName"].map(k=>c[k]=p[k]);
    changeVariant(c, showPhone, trigger);
}

function cpCircles(svg) {
    svg.selectAll("circle")
        .data(d => [[3,3,2],[6.6,4,1]].map(([cx,cy,r])=>({cx,cy,r,fill:getBgColor(d.p||d)})))
        .join("circle").attrs(d=>d);
}
function addColorPicker(svg) {
    svg.attr("viewBox","0 0 9 5.3");
    svg.append("rect").attrs({x:0,y:0,width:9,height:5.3,fill:"none"});
    svg.call(cpCircles);
    makeColorPicker(svg);
}
function makeColorPicker(elt) {
    elt.on("click", function (d) {
        let p = d.p || d;
        p.id = getPhoneNumber();
        colorPhones();
        d3.event.stopPropagation();
    });
}

function colorPhones() {
    updatePaths();
    let c = p=>p.active?getDivColor(p.id,true):null;
    doc.select("#phones").selectAll("div.phone-item")
        .style("background",c).style("border-color",c);
    let t = table.selectAll("tr").filter(r => !r.p.isTarget)
        .style("color", r => c(r.p));
    t.select("button").style("background-color", r => getCurveColor(r.p.id, 0));
    t = t.call(s => s.select(".remove").style("background-image", r => colorBar(r.p))
        .select("svg").call(cpCircles))
        .filter(r => r.sub === null || r.sub === 0)
        .select("td.channels");
    t.select("svg").remove();
    t.append("svg").datum(r => r.p).call(addKey);
}

let f_values = (function() {
    // Standard frequencies, all phone need to interpolate to this
    let f = [20];
    let step = Math.pow(2, 1/48); // 1/48 octave
    while (f[f.length-1] < 20000) { f.push(f[f.length-1] * step) }
    return f;
})();
let fr_to_ind = fr => d3.bisect(f_values, fr, 0, f_values.length-1);
function range_to_slice(xs, fn) {
    let r = xs.map(v => d3.bisectLeft(f_values, x.invert(fn(v))));
    return a => a.slice(Math.max(r[0],0), r[1]+1);
}

let norm_sel = ( default_normalization.toLowerCase() === "db" ) ? 0:1,
    norm_fr = default_norm_hz,
    norm_phon = default_norm_db;

function normalizePhone(p) {
    let vc = validChannels(p);
    if (!vc.length) return;
    if (norm_sel) { // fr
        let i = fr_to_ind(norm_fr);
        let avg = l => 20*Math.log10(d3.mean(l, d=>Math.pow(10,d/20)));
        p.norm = 60 - avg(vc.map(l=>l[i][1]));
    } else { // phon
        let g = getAvg(p);
        if (!g) return;
        p.norm = find_offset(g, norm_phon);
    }
    if (p.eq) normalizePhone(p.eq);
}

let norms = doc.select(".normalize").selectAll("div");
norms.classed("selected",(_,i)=>i===norm_sel);
function setNorm(_, i, change) {
    if (change !== false) {
        if (!this.checkValidity()) return;
        let v = +this.value;
        if (i) { norm_fr=v; } else { norm_phon=v; }
    }
    norm_sel = i;
    norms.classed("selected",(_,i)=>i===norm_sel);
    activePhones.forEach(normalizePhone);
    if (baseline.p) { baseline = getBaseline(baseline.p); }
    updateYCenter();
    
    if (!userConfigApplicationActive) {
        setUserConfig();
        updatePaths();
    } else {
        updatePaths("config");
    }
}
norms.select("input")
    .on("change input",setNorm)
    .on("keypress", function(_, i) {
        if (d3.event.key==="Enter") { setNorm.bind(this)(_,i); }
    });
norms.select("span").on("click", (_,i)=>setNorm(_,i,false));

let addPhoneSet = false, // Whether add phone button was clicked
    addPhoneLock= false;
function setAddButton(a) {
    if (a && cantCompare(activePhones)) return false;
    if (addPhoneSet !== a) {
        addPhoneSet = a;
        doc.select(".addPhone").classed("selected", a)
            .classed("locked", addPhoneLock &= a);
    }
    return true;
}
doc.select(".addPhone").selectAll("td")
    .on("click", ()=>setAddButton(!addPhoneSet));
doc.select(".addLock").on("click", function () {
    d3.event.preventDefault();
    let on = !addPhoneLock;
    if (!setAddButton(on)) return;
    if (on) {
        doc.select(".addPhone").classed("locked", addPhoneLock=true);
    }
});

function showPhone(p, exclusive, suppressVariant, trigger) {
    if (p.isTarget && activePhones.indexOf(p)!==-1) {
        removePhone(p);
        return;
    }
    if (p.isTarget) {
        exclusive = false;
    }
    if (addPhoneSet) {
        exclusive = false;
        if (!addPhoneLock || cantCompare(activePhones,1,null,true)) {
            setAddButton(false);
        }
    }
    let keep = !exclusive ? (q=>true)
             : (q => q.copyOf===p || q.pin || q.isTarget!==p.isTarget);
    if (cantCompare(activePhones.filter(keep),0, p)) return;
    if (!p.rawChannels) {
        let pid = p.id != null ? p.id : nextPhoneNumber();
        let items = doc.select("#phones").selectAll(".phone-item");
        let item = items.filter(q => q === p);
        item.style("background", getDivColor(pid, true))
            .style("border-color", getDivColor(pid, 1));
        item.select(".phone-item-add").classed("loading", true);
        if (exclusive) {
            items.filter(q => q.active && q.copyOf !== p && !q.pin
                           && q.isTarget === p.isTarget)
                .style("background", null)
                .style("border-color", null);
        }
        loadFiles(p, function (ch) {
            if (p.rawChannels) return;
            item.select(".phone-item-add").classed("loading", false);
            p.rawChannels = ch;
            showPhone(p, exclusive, suppressVariant, trigger);
            
            // Scroll to selected
            if (trigger) { scrollToActive(); }
            
            // Analytics event
            if (analyticsEnabled) { pushPhoneTag("phone_displayed", p, trigger); }
        });
        return;
    }
    smoothPhone(p);
    if (p.id == null) { p.id = getPhoneNumber(); }
    normalizePhone(p); p.offset=p.offset||0;
    if (p.isTarget && isCompensationTargetNameMatch(p) && !p.compTargetUserToggledHide) {
        p.hide = true;
    }
    if (exclusive) {
        /* Must use removePhone (not only active=false) so EQ children / p.eq links clear and
           extra-EQ reset runs — the old filter-assignment left orphan EQ traces on the graph. */
        activePhones.filter((q) => !keep(q)).forEach(removePhone);
        activePhones.forEach((q) => {
            if (keep(q)) {
                q.active = true;
            }
        });
        if (baseline.p && !baseline.p.active) {
            setBaseline(baseline0, 1);
        }
    }
    let blockedFromCompareList = !suppressVariant && !p.copyOf && p.objs && p.objs.length;
    if (activePhones.indexOf(p)===-1 && !blockedFromCompareList) {
        let avg = false;
        if (!p.isTarget) {
            let ap = activePhones.filter(p => !p.isTarget);
            avg = ap.length >= 1;
            if (ap.length===1 && ap[0].activeCurves.length!==1) {
                setCurves(ap[0], true);
            }
            activePhones.push(p);
        } else {
            activePhones.unshift(p);
        }
        p.active = true;
        setCurves(p, avg);
    }
    updatePaths(trigger);
    updatePhoneTable(trigger);
    d3.selectAll("#phones .phone-item,.target")
        .filter(p=>p.id!==undefined)
        .call(setPhoneTr);
    //Displays variant pop-up when phone displayed
    if (!suppressVariant && p.fileNames && !p.copyOf && window.innerWidth > 1000) {
        table.selectAll("tr").filter(r => r.p === p && (r.sub === null || r.sub === 0)).select(".variants").node().focus();
    } else {
        document.activeElement.blur();
    }
    if (extraEnabled && extraEQEnabled && typeof window.updateEQPhoneSelect === "function") {
        window.updateEQPhoneSelect();
    }
    if (!p.isTarget && alt_augment ) { augmentList(p); }
    
    // Apply user config view settings
    if (typeof trigger !== "undefined") {
        userConfigApplyViewSettings(p.fileName);
    }
}

function removeCopies(p) {
    if (p.objs) {
        p.objs.forEach(q=>q.active=false);
        delete p.objs;
    }
    removePhone(p);
}

function removePhone(p) {
    let hadEqChild = Boolean(!p.isTarget && p.eq);
    if (p.eqParent) {
        p.eqParent.eq = null;
        p.eqParent = null;
    }
    if (p.eq) {
        let eqP = p.eq;
        p.eq = null;
        eqP.eqParent = null;
        eqP.active = false;
    }
    p.active = p.pin = false; nextPN = null;
    activePhones = activePhones.filter(q => q.active);
    if (!p.isTarget) {
        let ap = activePhones.filter(p => !p.isTarget);
        if (ap.length === 1) {
            setCurves(ap[0], false);
        }
    }
    updatePaths();
    if (baseline.p && !baseline.p.active) { setBaseline(baseline0); }
    updatePhoneTable();
    d3.selectAll("#phones div,.target")
        .filter(q=>q===(p.copyOf||p))
        .call(setPhoneTr);
    if (extraEnabled && extraEQEnabled && typeof window.updateEQPhoneSelect === "function") {
        window.updateEQPhoneSelect();
        if (hadEqChild && typeof window.eqResetParametricAfterBaseModelRemoved === "function") {
            window.eqResetParametricAfterBaseModelRemoved();
        }
    }
}

function removeSampleRow(p, sub) {
    if (sub === null || sub === undefined) {
        removePhone(p);
        return;
    }
    let curve = p.activeCurves[sub],
        chIdx = curve ? p.channels.indexOf(curve.l) : -1;
    if (chIdx >= 0) {
        p.channels[chIdx] = null;
    }
    if (!validChannels(p).length) {
        removePhone(p);
        return;
    }
    setCurves(p, p.avg, undefined, p.ssamp);
    updatePaths();
    updatePhoneTable();
    d3.selectAll("#phones div,.target")
        .filter(q => q === (p.copyOf || p))
        .call(setPhoneTr);
    if (baseline.p && !baseline.p.active) {
        setBaseline(baseline0);
    }
    if (extraEnabled && extraEQEnabled && typeof window.updateEQPhoneSelect === "function") {
        window.updateEQPhoneSelect();
    }
}

function asPhoneObj(b, p, isInit, inits) {
    if (!isInit) {
        isInit = _ => false;
    }
    let r = { brand:b, dispBrand:b.name };
    if (typeof p === "string") {
        r.phone = r.fileName = p;
        if (isInit(p)) inits.push(r);
    } else {
        r.phone = p.name;
        if (p.collab) {
            r.dispBrand += " x "+p.collab;
            r.collab = brandMap[p.collab];
        }
        let f = p.file || p.name;
        if (typeof f === "string") {
            r.fileName = f;
            if (isInit(f)) inits.push(r);
        } else {
            r.fileNames = f;
            r.vars = {};
            let dns = f;
            if (p.suffix) {
                dns = p.suffix.map(
                    s => p.name + (s ? " "+s : "")
                );
            } else if (p.prefix) {
                let reg = new RegExp("^"+p.prefix+"\s*", "i");
                dns = f.map(n => {
                    n = n.replace(reg, "");
                    return p.name + (n.length ? " "+n : n);
                });
            }
            r.dispNames = dns;
            r.fileName = f[0];
            r.dispName = dns[0];
            let c = r;
            f.map((fn,i) => {
                if (!isInit(fn)) return;
                c.fileName=fn; c.dispName=dns[i];
                inits.push(c);
                c = {copyOf:r};
            });
        }
    }
    r.dispName = r.dispName || r.phone;
    r.fullName = r.dispBrand + " " + r.phone;
    if (alt_augment) {
        r.reviewScore = p.reviewScore;
        r.reviewLink = p.reviewLink;
        r.shopLink = p.shopLink;
        r.price = p.price;
    }
    return r;
}

d3.json(typeof PHONE_BOOK !== "undefined" ? PHONE_BOOK
            : DIR+"phone_book.json?"+ new Date().getTime()).then(function (brands) {
    let brandMap = window.brandMap = {},
        inits = [],
        initReq = typeof init_phones !== "undefined" ? [init_phones].flat() : false;
    loadFromShare = 0;
    
    if (ifURL) {
        let url = targetWindow.location.href,
            par = "share=";
            emb = "embed";
        baseURL = url.split("?").shift();
        
        if (url.includes(par) && url.includes(emb)) {
            initReq = decodeURIComponent(url.replace(/_/g," ").split(par).pop()).split(",");
            loadFromShare = 2;
            
            setModeEmbed();
        } else if (url.includes(par)) {
            initReq = decodeURIComponent(url.replace(/_/g," ").split(par).pop()).split(",");
            loadFromShare = 1;
        } else if (url.includes(emb)) {
            setModeEmbed();
        }
    }
    
    // Apply user config to inits
    userConfigAppendInits(initReq);
    setInitPhoneOrderFromReq(Array.isArray(initReq) ? initReq : null);
    
    let isInit = initReq ? f => initReq.indexOf(f) !== -1
                         : _ => false;
    
    if (loadFromShare === 1) {
        initMode = "share";
    } else if (loadFromShare === 2) {
        initMode = "embed";
    } else {
        initMode = "config";
    }

    brands.push({ name: "Uploaded", phones: [] });
    brands.forEach(b => brandMap[b.name] = b);
    brands.forEach(function (b) {
        b.active = false;
        b.phoneObjs = b.phones.map(function (p) {
            return asPhoneObj(b, p, isInit, inits);
        });
    });

    let allPhones = window.allPhones = d3.merge(brands.map(b=>b.phoneObjs)),
        currentBrands = [];
    if (!initReq) inits.push(allPhones[0]);

    function setClicks(fn) { return function (elt) {
        elt .on("mousedown", () => d3.event.preventDefault())
            .on("click", p => fn(p,!d3.event.ctrlKey))
            .on("auxclick", p => d3.event.button===1 ? fn(p,0) : 0);
    }; }

    let brandSel = doc.select("#brands").selectAll()
        .data(brands).join("div")
        .text(b => b.name + (b.suffix?" "+b.suffix:""))
        .call(setClicks(setBrand));

    let bg = (h,fn) => function (p) {
        d3.select(this).style("background", fn(p));
        (p.objs||[p]).forEach(q=>hl(q,h));
    }
    window.updatePhoneSelect = () => {
        doc.select("#phones").selectAll("div.phone-item")
            .data(allPhones)
            .join((enter) => {
                let phoneDiv = enter.append("div")
                    .attr("class","phone-item")
                    .attr("name", p=>p.fullName)
                    .on("mouseover", bg(true, p => getDivColor(p.id===undefined?nextPhoneNumber():p.id, true)))
                    .on("mouseout" , bg(false,p => p.id!==undefined?getDivColor(p.id,p.active):null))
                    .call(setClicks(showPhone));
                phoneDiv.append("span").text(p=>p.fullName);
                // Adding the + selection button
                phoneDiv.append("div")
                    .attr("class", "phone-item-add")
                    .on("click", p => {
                        d3.event.stopPropagation();
                        showPhone(p, 0);
                    });
           });
    };
    updatePhoneSelect();

    if (targets) {
        let b = window.brandTarget = { name:"Targets", active:false },
            ti = -targets.length,
            ph = t => ({
                isTarget:true, brand:b,
                dispName:t, phone:t, fullName:t+" Target", fileName:t+" Target"
            });
        d3.select(".manage").insert("div",".manageTable")
            .attr("class", "targets collapseTools");
        let l = (text,c) => s => s.append("div").attr("class","targetLabel").append("span").text(text);
        let ts = b.phoneObjs = doc.select(".targets").call(l("Targets"))
            .selectAll().data(targets).join("div").call(l(t=>t.type))
            .style("flex-grow",t=>t.files.length).attr("class","targetClass")
            .selectAll().data(t=>t.files.map(ph))
            .join("div").text(t=>t.dispName).attr("class","target")
            .call(setClicks(showPhone))
            .data();
        ts.forEach((t,i) => {
            t.id = i-ts.length;
            if (isInit(t.fileName)) inits.push(t);
        });
    }

    if (initReq && Array.isArray(initReq) && initReq.length) {
        inits.sort((a, b) => {
            let ia = initReq.indexOf(String(a.fileName || "").trim());
            let ib = initReq.indexOf(String(b.fileName || "").trim());
            ia = ia < 0 ? 1e9 : ia;
            ib = ib < 0 ? 1e9 : ib;
            return ia - ib;
        });
    }

    inits.map(p => p.copyOf ? showVariant(p.copyOf, p, initMode)
                            : showPhone(p,0,1, initMode));

    function setBrand(b, exclusive) {
        let phoneSel = doc.select("#phones").selectAll("div.phone-item");
        let incl = currentBrands.indexOf(b) !== -1;
        let hasBrand = (p,b) => p.brand===b || p.collab===b;
        if (exclusive || currentBrands.length===0) {
            currentBrands.forEach(br => br.active = false);
            if (incl) {
                currentBrands = [];
                phoneSel.style("display", null);
                phoneSel.select("span").text(p=>p.fullName);
            } else {
                currentBrands = [b];
                phoneSel.style("display", p => hasBrand(p,b)?null:"none");
                phoneSel.filter(p => hasBrand(p,b)).select("span").text(p=>p.phone);
            }
        } else {
            if (incl) return;
            if (currentBrands.length === 1) {
                phoneSel.select("span").text(p=>p.fullName);
            }
            currentBrands.push(b);
            phoneSel.filter(p => hasBrand(p,b)).style("display", null);
        }
        if (!incl) b.active = true;
        brandSel.classed("active", br => br.active);
    }

    let phoneSearch = new Fuse(
        allPhones,
        {
            shouldSort: false,
            tokenize: false,
            threshold: 0.2,
            minMatchCharLength: 2,
            keys: [
                {weight:0.3, name:"dispBrand"},
                {weight:0.1, name:"brand.suffix"},
                {weight:0.6, name:"phone"}
            ]
        }
    );
    let brandSearch = new Fuse(
        brands,
        {
            shouldSort: false,
            tokenize: false,
            threshold: 0.05,
            minMatchCharLength: 3,
            keys: [
                {weight:0.9, name:"name"},
                {weight:0.1, name:"suffix"},
            ]
        }
    );
    doc.select(".search").on("input", function () {
        //d3.select(this).attr("placeholder",null);
        let fn, bl = brands;
        let c = currentBrands;
        let test = p => c.indexOf(p.brand )!==-1
                     || c.indexOf(p.collab)!==-1;
        if (this.value.length > 1) {
            let s = phoneSearch.search(this.value),
                t = c.length ? s.filter(test) : s;
            if (t.length) s = t;
            fn = p => s.indexOf(p)!==-1;
            let b = brandSearch.search(this.value);
            if (b.length) bl = b;
        } else {
            fn = c.length ? test : (p=>true);
        }
        let phoneSel = doc.select("#phones").selectAll("div.phone-item");
        phoneSel.style("display", p => fn(p)?null:"none");
        brandSel.style("display", b => bl.indexOf(b)!==-1?null:"none");
    });

    doc.select("#recolor").on("click", function () {
        allPhones.forEach(p => { if (!p.isTarget) { delete p.id; } });
        phoneNumber = 0; nextPN = null;
        activePhones.forEach(p => { if (!p.isTarget) { p.id = getPhoneNumber(); } });
        colorPhones();
    });
    
    doc.select("#theme").on("click", function () {
        themeChooser("change");
    });
    
    userConfigApplyNormalization();
});

let pathHoverTimeout;
function pathHL(c, m, imm) {
    gpath.selectAll("path").classed("highlight", c ? d=>d===c   : false);
    table.selectAll("tr").classed("highlight", c ? r => {
        if (r.p !== c.p) return false;
        if (r.sub === null || r.sub === undefined) return true;
        return c === r.p.activeCurves[r.sub];
    } : false);
    if (pathHoverTimeout) { clearTimeout(pathHoverTimeout); }
    if(!stickyLabels) {
        clearLabels();
        pathHoverTimeout =
            imm ? pathTooltip(c, m) :
            c   ? setTimeout(pathTooltip, 400, c, m) :
            undefined;
    }
}
function pathTooltip(c, m) {
    let g = gr.selectAll(".lineLabel").data([c.id])
        .join("g").attr("class","lineLabel")
        .attr("pointer-events", "none");
    let t = g.append("text")
        .attrs({x:m[0], y:m[1]-6, fill:getTooltipColor(c)})
        .text(t=>t);
    let b = t.node().getBBox(),
        o = pad.l+W - b.width;
    if (o < b.x) { t.attr("x",o); b.x=o; }
    // Background
    g.insert("rect", "text")
        .attrs({x:b.x-1, y:b.y-1, width:b.width+2, height:b.height+2});
}
let interactInspect = false;
let graphInteract = imm => function () {
    /* EQ graph drag uses Pointer Events on document + pointer capture; d3 mousemove still fires on
       Safari/trackpad with coordinates that can disagree with the pointer stream, which fights
       syncEqHoverPreview and pathHL (strobe on nearest-curve highlight). Ignore synthetic mouse path
       for the whole gesture. */
    if (eqGraphPointerState) {
        return;
    }
    let ev = d3.event;
    if (ev && typeof ev.clientX === "number" && typeof ev.clientY === "number") {
        lastGraphPlotPointerClient = { x: ev.clientX, y: ev.clientY };
    }
    let cs = curvesPhonesFirstForPointer(d3.merge(activePhones.map(p=>p.hide?[]:(p.activeCurves||[]))));
    let m = d3.mouse(this);
    if (!cs.length) {
        syncEqHoverPreview(null);
        return;
    }
    if (imm && eqGraphSkipNextClick) {
        eqGraphSkipNextClick = false;
        if (eqGraphSkipClickClearTimer) {
            clearTimeout(eqGraphSkipClickClearTimer);
            eqGraphSkipClickClearTimer = null;
        }
        return;
    }
    if (imm && eqGraphSuppressClickAddFromTouch) {
        eqGraphSuppressClickAddFromTouch = false;
        if (eqGraphTouchSuppressClearTimer) {
            clearTimeout(eqGraphTouchSuppressClearTimer);
            eqGraphTouchSuppressClearTimer = null;
        }
    } else if (imm && !interactInspect && tryEqGraphClickAddFilter(m)) {
        syncEqHoverPreview(m);
        return;
    }
    syncEqHoverPreview(m);
    if (interactInspect) {
        let ind = fr_to_ind(x.invert(m[0])),
            x1 = x(f_values[ind]),
            x0 = ind>0 ? x(f_values[ind-1]) : x1,
            sel= m[0]-x0 < x1-m[0],
            xv = sel ? x0 : x1;
        ind -= sel;
        function init(e) {
            e.attr("class","inspector");
            e.append("line").attrs({x1:0,x2:0, y1:pad.t,y2:pad.t+H});
            e.append("text").attr("class","insp_dB").attr("x",2);
        }
        let insp = gr.selectAll(".inspector").data([xv])
            .join(enter => enter.append("g").call(init))
            .attr("transform",xv=>"translate("+xv+",0)");
        let dB = insp.select(".insp_dB").text(f_values[ind]+" Hz");
        let cy = cs.map(c => [c, baseline.fn(c.l)[ind][1]+getOffset(c.p)]);
        cy.sort((d,e) => d[1]-e[1]);
        function newTooltip(t) {
            t.attr("class","lineLabel")
                .attr("pointer-events", "none")
                .attr("fill",d=>getTooltipColor(d));
            t.append("text").attr("x",2).text(d=>d.id);
            t.append("g").selectAll().data([0,1])
                .join("text")
                .attr("x",-16)
                .attr("text-anchor",i=>i?"start":"end");
            t.datum(function(){return this.getBBox();});
            t.insert("rect", "text")
                .attrs(b=>({x:b.x-1, y:b.y-1, width:b.width+2, height:b.height+2}));
        }
        let tt = insp.selectAll(".lineLabel").data(cy.map(d=>d[0]), d=>d.id)
            .join(enter => enter.insert("g","line").call(newTooltip));
        let start = tt.select("g").datum((_,i) => cy[i][1])
            .selectAll("text").data(d => {
                let s=d<-0.05?"-":""; d=Math.abs(d)+0.05;
                return [s+Math.floor(d)+".",Math.floor((d%1)*10)];
            })
            .text(t=>t)
            .filter((_,i)=>i===0)
            .nodes().map(n=>n.getBBox().x-2);
        tt.select("rect")
            .attrs((b,i)=>({x:b.x+start[i]-1, width:b.width-start[i]+2}));
        // Now compute heights
        let hm = d3.max(tt.data().map(b=>b.height)),
            hh = (y.invert(0)-y.invert(hm-1))/2,
            stack = [];
        cy.map(d=>d[1]).forEach(function (h,i) {
            let n = 1;
            let overlap = s => h/n - s.h/s.n <= hh*(s.n+n);
            let l = stack.length;
            while (l && overlap(stack[--l])) {
                let s = stack.pop();
                h += s.h; n += s.n;
            }
            stack.push({h:h, n:n});
        });
        let ch = d3.merge(stack.map((s,i) => {
            let h = s.h/s.n - (s.n-1)*hh;
            return d3.range(s.n).map(k => h+k*2*hh);
        }));
        tt.attr("transform",(_,i) => "translate(0,"+(y(ch[i])+5)+")");
        dB.attr("y", y(ch[ch.length-1]+2*hh)+1);
    } else {
        let d = 30 * W0 / gr.node().getBoundingClientRect().width,
            sl= range_to_slice([-1,1],s=>m[0]+d*s);
        let ind = cs
            .map(c =>
                sl(baseline.fn(c.l))
                    .map(p => Math.hypot(x(p[0])-m[0], y(p[1]+getOffset(c.p))-m[1]))
                    .reduce((a,b)=>Math.min(a,b), d)
            )
            .reduce((a,b,i) => b<a[1] ? [i,b] : a, [-1,d])[0];
        pathHL(ind===-1 ? false : cs[ind], m, imm);
    }
}
function stopInspect() { gr.selectAll(".inspector").remove(); }
graphPlotHitRect = gr.append("rect")
    .attr("class", "graph-plot-hit")
    .style("touch-action", "none")
    .attrs({x:pad.l,y:pad.t,width:W,height:H,opacity:0})
    .on("mousemove", graphInteract())
    .on("mouseout", () => {
        if (eqGraphPointerState) {
            return;
        }
        /* After pointer capture release, some browsers emit mouseout even though the cursor is
           still over the plot; defer and re-hit-test so EQ hover / path highlight stay in sync. */
        let plot = graphPlotHitRect && graphPlotHitRect.node();
        let ev = d3.event;
        let cx = ev && typeof ev.clientX === "number" ? ev.clientX : NaN;
        let cy = ev && typeof ev.clientY === "number" ? ev.clientY : NaN;
        requestAnimationFrame(() => {
            if (eqGraphPointerState) {
                return;
            }
            if (plot && Number.isFinite(cx) && Number.isFinite(cy)) {
                let r = plot.getBoundingClientRect();
                if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
                    lastGraphPlotPointerClient = { x: cx, y: cy };
                    let m = clientToGraphPlotXY(cx, cy);
                    if (m) {
                        syncEqHoverPreview(m);
                    }
                    return;
                }
            }
            syncEqHoverPreview(null);
            interactInspect ? stopInspect() : pathHL(false);
        });
    })
    .on("click", graphInteract(true));
gEqSoundRangeBrush.raise();
gEqFilterMarkers.raise();
gEqHoverPreview.raise();

/** SVG user-space [x,y] matching d3.mouse(plot rect); works with native event listeners (d3.mouse does not). */
function clientToGraphPlotXY(clientX, clientY) {
    let plot = graphPlotHitRect && graphPlotHitRect.node();
    if (!plot) {
        return null;
    }
    let svg = plot.ownerSVGElement || (plot.closest && plot.closest("svg"));
    if (!svg || !svg.createSVGPoint) {
        return null;
    }
    let ctm = svg.getScreenCTM();
    if (!ctm) {
        return null;
    }
    let pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    let p = pt.matrixTransform(ctm.inverse());
    return [p.x, p.y];
}

/** Inverse of clientToGraphPlotXY: graph SVG coords → viewport client pixels. */
function graphPlotXYToClient(svgX, svgY) {
    let plot = graphPlotHitRect && graphPlotHitRect.node();
    if (!plot) {
        return null;
    }
    let svg = plot.ownerSVGElement || (plot.closest && plot.closest("svg"));
    if (!svg || !svg.createSVGPoint) {
        return null;
    }
    let ctm = svg.getScreenCTM();
    if (!ctm) {
        return null;
    }
    let pt = svg.createSVGPoint();
    pt.x = svgX;
    pt.y = svgY;
    let p = pt.matrixTransform(ctm);
    return [p.x, p.y];
}

doc.select("#inspector").on("click", function () {
    clearLabels();
    stopInspect();
    d3.select(this).classed("selected", interactInspect = !interactInspect);
});

doc.select("#expandTools").on("click", function () {
    let t=doc.select(".tools"), cl="collapseTools", v=!t.classed(cl);
    [t,doc.select(".targets")].forEach(s=>s.classed(cl, v));
});

d3.selectAll(".helptip").on("click", function() {
    let e = d3.select(this);
    e.classed("active", !e.classed("active"));
});

// Copy URL button functionality
function copyUrlInit() {
    let copyUrlButton = document.querySelector("button#copy-url");

    copyUrlButton.addEventListener("click", function(e) {
        let urlHost = document.createElement('input'),
            currentUrl = targetWindow.location.href;

        urlHost.setAttribute("style","position: fixed; opacity: 0.0;");
        urlHost.value = currentUrl;
        document.body.appendChild(urlHost);

        urlHost.select();
        document.execCommand('copy');
        document.body.removeChild(urlHost);

        e.stopPropagation();

        copyUrlButton.classList.add("clicked");
        setTimeout(function() {
            copyUrlButton.classList.remove("clicked");
        }, 600);
        
        // Analytics event
        if (analyticsEnabled) { pushEventTag("clicked_copyUrl", targetWindow); }
    });
}
copyUrlInit();

// Theme Chooser
function themeChooser(command) {
    let docBody = document.querySelector("body"),
        themeButton = document.querySelector("button#theme"),
        themeCurrent = themeButton.getAttribute("current-theme");
    
    // If a change event, make changes to state
    if (command === "change") {
        if (themeCurrent === "theme-dark") {
            localStorage.setItem("theme-pref", "theme-contrast");
        } else if (themeCurrent === "theme-contrast") {
            localStorage.setItem("theme-pref", "theme-default");
        } else {
            localStorage.setItem("theme-pref", "theme-dark");
        }
    }
    
    let themePref = localStorage.getItem("theme-pref");
    
    // Apply state
    if (themePref === "theme-dark") {
        docBody.classList.remove("theme-default", "theme-contrast");
        docBody.classList.add("theme-dark");
        themeButton.textContent = "contrast mode";
        
    } else if (themePref === "theme-contrast") {
        docBody.classList.remove("theme-default", "theme-dark");
        docBody.classList.add("theme-contrast");
        themeButton.textContent = "default mode";
        
    } else {
        docBody.classList.remove("theme-dark", "theme-contrast");
        docBody.classList.add("theme-default");
        themeButton.textContent = "dark mode";
    }
    
    themeButton.setAttribute("current-theme", themePref);
}
if ( themingEnabled ) {
    let themeButton = document.createElement("button"),
        miscTools = document.querySelector("div.miscTools");
        
    themeButton.setAttribute("id", "theme");
    themeButton.textContent = "dark mode";
    themeButton.setAttribute("current-theme", "theme-default");
    miscTools.append(themeButton);
    
    themeChooser();
}

// Map faux download button
function mapDownloadFaux() {
    let downloadButton = document.querySelector("button#download"),
        downloadFaux = document.querySelector("button#download-faux");
    
    downloadFaux.addEventListener("click", function() {
        downloadButton.click();
    });
}
mapDownloadFaux();

// Set focused scroll list
function setFocusedList(selectedList) {
    let listsContainer = document.querySelector("div.select");

    listsContainer.setAttribute("data-selected", selectedList)
}

function focusedListClicks() {
    let listClickTragets = document.querySelectorAll("*[data-list=\"brands\"], *[data-list=\"models\"]");

    listClickTragets.forEach((clickedTarget) => {
        clickedTarget.addEventListener("click", () => {
            let selectedList = clickedTarget.getAttribute("data-list")
            setFocusedList(selectedList);
            window.hideExtraPanel && window.hideExtraPanel(selectedList);
        });
    });

    let brandsList = document.querySelector("div.scroll#brands");
    
    brandsList.addEventListener("click", function(e) {
        let clickedElem = e.target,
            clickedElemIsBrand = clickedElem.matches("div.scroll#brands div");
        
        if (clickedElemIsBrand) {
            setFocusedList("models");
            e.stopPropagation();
        }
    });

}
focusedListClicks();

function focusedListSwipes() {
    let horizontalSwipeTarget = document.querySelector("div.scroll-container"),
        listsContainer = document.querySelector("div.select"),
        swipableList = document.querySelector("div.scrollOuter[data-list=\"models\"]");
    touchDelta = 0;
    
    horizontalSwipeTarget.addEventListener("touchstart", function(e) {
        selectedList = listsContainer.getAttribute("data-selected");
        touchStart = e.targetTouches[0].screenX;

        horizontalSwipeTarget.addEventListener("touchmove", function(e) {
            touchNow = e.targetTouches[0].screenX;
            touchDelta = touchNow - touchStart,
            touchDeltaNegative = 0 - touchDelta;
            
            if ( selectedList === "models" && touchDelta > 0 && touchDelta < 100 ) {
                swipableList.setAttribute("style","right: "+ touchDeltaNegative +"px;")
            }
            
            if ( selectedList === "brands" && touchDelta < 0 && touchDelta > -100 ) {
                swipableList.setAttribute("style","right: "+ touchDeltaNegative +"px;")
            }
        });
    });

    horizontalSwipeTarget.addEventListener("touchend", function(e) {
        if ( touchDelta > 49 ) {
            listsContainer.setAttribute("data-selected","brands");
        }

        if ( touchDelta < -50 ) {
            listsContainer.setAttribute("data-selected","models");
        }
        
        swipableList.setAttribute("style","")
        touchStart = 0;
        touchNow = 0;
        touchDelta = 0;
        
        //horizontalSwipeTarget.removeEventListener("touchmove");
    });
}
focusedListSwipes();

// Scroll list to active phone on init
function scrollToActive() {
    try {
        let phoneList = document.querySelector('div.scroll#phones'),
            firstActivePhone = document.querySelector('div.phone-item[style*=border]'),
            offset = firstActivePhone.offsetTop - 26;

        phoneList.scrollTop = offset;
    }
    catch {}
}

// Set focused panel
function setFocusedPanel() {
    let panelsContainer = document.querySelector("main.main"),
        primaryPanel = document.querySelector(".parts-primary"),
        secondaryPanel = document.querySelector(".parts-secondary"),
        phonesList = document.querySelector("div#phones"),
        graphBox = document.querySelector("div.graph-sizer"),
        mobileHelper = document.querySelector("tr.mobile-helper");
    
    panelsContainer.setAttribute("data-focused-panel","secondary");
    
    mobileHelper.addEventListener("click", function() {
        panelsContainer.setAttribute("data-focused-panel","secondary");
    });

    secondaryPanel.addEventListener("click", function() {
        panelsContainer.setAttribute("data-focused-panel","secondary");
    });
    
    graphBox.addEventListener("click", function() {
        let previousState = panelsContainer.getAttribute("data-focused-panel");
        
        if ( previousState === "primary") {
            panelsContainer.setAttribute("data-focused-panel","secondary");
        } else if ( previousState === "secondary" ) {
            panelsContainer.setAttribute("data-focused-panel","primary");
        }
    });
    
    // Touch events
    let verticalSwipeTargets = document.querySelectorAll("div.selector-tabs, input.search");
    
    verticalSwipeTargets.forEach(function(target) {
        target.addEventListener("touchstart", function(e) {
            focusedPanel = document.querySelector("main.main").getAttribute("data-focused-panel");

            touchStart = e.targetTouches[0].screenY;

            target.addEventListener("touchmove", function(e) {
                touchNow = e.targetTouches[0].screenY;
                touchDelta = touchNow - touchStart;

                if ( focusedPanel === "secondary" && touchDelta > 0 && touchDelta < 200) {
                    secondaryPanel.setAttribute("style", "top: " + touchDelta + "px;")
                } else if ( focusedPanel === "primary" && touchDelta < 0 && touchDelta > -200) {
                    secondaryPanel.setAttribute("style", "top: " + touchDelta + "px;")
                }
            });
        });

        target.addEventListener("touchend", function(e) {
            if ( touchDelta > 49 ) {
                panelsContainer.setAttribute("data-focused-panel","primary");
            }

            if ( touchDelta < -50 ) {
                panelsContainer.setAttribute("data-focused-panel","secondary");
            }

            secondaryPanel.setAttribute("style", "")
            touchStart = 0;
            touchNow = 0;
            touchDelta = 0;
        });
    
        target.addEventListener("wheel", function(e) {
            let wheelDelta = e.deltaY;

            if (wheelDelta < -5) {
                panelsContainer.setAttribute("data-focused-panel","primary");
            }

            if (wheelDelta > 5) {
                panelsContainer.setAttribute("data-focused-panel","secondary");
            }
        });
    });
}
setFocusedPanel();

// Blur focus from inputs on submit
function blurFocus() {
    let inputFields = document.querySelectorAll("input"),
        body = document.querySelector("body");
    
    inputFields.forEach(function(field) {
        field.addEventListener("keyup", function(e) {
            if (e.keyCode === 13) {
                field.blur();
            }
        });
        
        field.addEventListener("focus", function() {
            body.setAttribute("data-input-state","focus");
        });
        
        field.addEventListener("blur", function() {
            body.setAttribute("data-input-state","blur");
        });
    });
}
blurFocus();

/* Over number inputs: cancel native wheel value stepping only; apply the same delta to the extra panel scroll. */
(() => {
    let extraPanel = document.querySelector("div.select > div.extra-panel");
    if (!extraPanel) {
        return;
    }
    extraPanel.addEventListener("wheel", (e) => {
        if (e.ctrlKey || e.metaKey) {
            return;
        }
        let t = e.target;
        if (!t || t.nodeType !== 1 || t.tagName !== "INPUT") {
            return;
        }
        if (t.getAttribute("type") !== "number") {
            return;
        }
        if (!extraPanel.contains(t)) {
            return;
        }
        let dy = e.deltaY;
        if (e.deltaMode === 1) {
            dy *= 16;
        } else if (e.deltaMode === 2) {
            dy *= extraPanel.clientHeight || 0;
        }
        if (Math.abs(e.deltaX) > Math.abs(dy)) {
            return;
        }
        if (!dy) {
            return;
        }
        e.preventDefault();
        extraPanel.scrollTop += dy;
    }, { capture: true, passive: false });
})();

// Add extra feature
function addExtra() {
    let extraButton = document.querySelector("div.select > div.selector-tabs > button.extra");
    // Disable functions by config
    if (!extraEnabled) {
        extraButton.remove();
        return;
    }
    if (!extraUploadEnabled) {
        document.querySelector("div.extra-panel > div.extra-upload").style["display"] = "none";
    }
    if (!extraEQEnabled) {
        document.querySelector("div.extra-panel > div.extra-eq").style["display"] = "none";
    } else {
        let eqHistWrap = document.getElementById("extra-eq-change-history");
        if (eqHistWrap) {
            eqHistWrap.hidden = false;
        }
    }
    if (!extraToneGeneratorEnabled) {
        document.querySelector("div.extra-panel div.extra-tone-generator").style["display"] = "none";
    }
    if (typeof extraPinkNoiseEnabled !== "undefined" && !extraPinkNoiseEnabled) {
        document.querySelector("div.extra-panel div.extra-pink-noise").style["display"] = "none";
    }
    if (typeof extraMusicEnabled !== "undefined" && !extraMusicEnabled) {
        document.querySelector("div.extra-panel div.extra-music").style["display"] = "none";
    }
    // Show and hide extra panel
    window.showExtraPanel = () => {
        document.querySelector("div.select > div.selector-panel").style["display"] = "none";
        document.querySelector("div.select > div.extra-panel").style["display"] = "flex";
        document.querySelector("div.select").setAttribute("data-selected", "extra");
        if (analyticsEnabled) { pushEventTag("clicked_equalizerTab", targetWindow); }
        if (typeof window.updateEQPhoneSelect === "function") {
            window.updateEQPhoneSelect();
        }
        applyParametricEqGraphTraceFocus();
        updateEqTraceOpacity();
        updateEqFilterMarkers();
        eqSoundRangeUiHooks.syncBrushFromInputs();
    };
    extraButton.addEventListener("click", showExtraPanel);
    // Upload function
    let uploadType = null;
    let fileFR = document.querySelector("#file-fr");
    document.querySelector("div.extra-upload button.upload-fr").addEventListener("click", () => {
        uploadType = "fr";
        fileFR.click();
    });
    document.querySelector("div.extra-upload button.upload-target").addEventListener("click", () => {
        uploadType = "target";
        fileFR.click();
    });
    let addOrUpdatePhone = (brand, phone, ch) => {
        let phoneObj = asPhoneObj(brand, phone);
        phoneObj.rawChannels = ch;
        phoneObj.isDynamic = true;
        let phoneObjs = brand.phoneObjs;
        let oldPhoneObj = phoneObjs.filter(p => p.phone == phone.name)[0]
        if (oldPhoneObj) {
            oldPhoneObj.active && removePhone(oldPhoneObj);
            phoneObj.id = oldPhoneObj.id;
            phoneObjs[phoneObjs.indexOf(oldPhoneObj)] = phoneObj;
            allPhones[allPhones.indexOf(oldPhoneObj)] = phoneObj;
        } else {
            brand.phones.push(phone);
            phoneObjs.push(phoneObj);
            allPhones.push(phoneObj);
        }
        updatePhoneSelect();
        return phoneObj;
    };
    fileFR.addEventListener("change", (e) => {
        let file = e.target.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onload = (e) => {
            let name = file.name.replace(/\.[^\.]+$/, "");
            let phone = { name: name };
            let ch = [tsvParse(e.target.result)];
            if (ch[0].length < 128) {
                alert("Parse frequence response file failed: invalid format.");
                return;
            }
            ch[0] = Equalizer.interp(f_values, ch[0]);
            if (uploadType === "fr") {
                name.match(/ R$/) && ch.splice(0, 0, null);
                let phoneObj = addOrUpdatePhone(brandMap.Uploaded, phone, ch);
                showPhone(phoneObj, false);
            } else if (uploadType === "target") {
                let fullName = name + (name.match(/ Target$/i) ? "" : " Target");
                let existsTargets = targets.reduce((a, b) => a.concat(b.files), []).map(f => f += " Target");
                if (existsTargets.indexOf(fullName) >= 0) {
                    alert("This target already exists on this tool, please select it instead of upload.");
                    return;
                }
                let phoneObj = {
                    isTarget: true,
                    brand: brandTarget,
                    dispName: name,
                    phone: name,
                    fullName: fullName,
                    fileName: fullName,
                    rawChannels: ch,
                    isDynamic: true,
                    id: -brandTarget.phoneObjs.length
                };
                showPhone(phoneObj, true);
            }
        };
        reader.readAsText(file);
    });
    // EQ Function
    let eqPhoneSelect = document.querySelector("div.extra-eq select[name='phone']");
    let eqPhoneTargetSelect = document.querySelector("div.extra-eq select[name='eq-target']");
    /** EQ model row: explicit model dropdown match, else first graphed IEM (not target, not "* EQ" child name). */
    let resolveEqModelPhone = () => {
        let sel = eqPhoneSelect && eqPhoneSelect.value;
        if (sel) {
            return activePhones.filter((p) => p.fullName === sel)[0] || null;
        }
        return activePhones.filter((p) =>
            !p.isTarget && p.fullName && !p.fullName.match(/ EQ$/))[0] || null;
    };
    /** Comparison trace: explicit `eq-target` value if set and valid, else first `isTarget`, else first other IEM (never the model’s parametric EQ child). */
    let resolveEqTargetPhone = (modelP, tsel) => {
        if (!modelP) {
            return null;
        }
        let fromSel = tsel
            ? activePhones.filter((p) => p.fullName === tsel)[0]
            : null;
        if (fromSel && !isCompensationTargetNameMatch(fromSel)) {
            return fromSel;
        }
        let eqP = modelP.eq || null;
        return activePhones.filter((p) => p.isTarget && !isCompensationTargetNameMatch(p))[0]
            || activePhones.filter((p) => p !== modelP && p !== eqP && !p.isTarget
                && !isCompensationTargetNameMatch(p))[0] || null;
    };
    let prevParametricFocusActive = false;
    applyParametricEqGraphTraceFocus = () => {
        let tab = document.querySelector("div.select");
        let active = extraEnabled && extraEQEnabled && tab && tab.getAttribute("data-selected") === "extra";
        if (!active) {
            if (prevParametricFocusActive) {
                prevParametricFocusActive = false;
                updatePaths(false);
            }
            return;
        }
        let modelP = resolveEqModelPhone();
        if (!modelP) {
            if (prevParametricFocusActive) {
                prevParametricFocusActive = false;
                updatePaths(false);
            }
            return;
        }
        prevParametricFocusActive = true;
        let tsel = eqPhoneTargetSelect && eqPhoneTargetSelect.value;
        let targetP = resolveEqTargetPhone(modelP, tsel);
        let eqP = modelP && modelP.eq;
        let showSet = new Set([modelP, eqP, targetP].filter(Boolean));
        gpath.selectAll("path").each(function (c) {
            if (!c || !c.p) {
                return;
            }
            let el = d3.select(this);
            let vis = showSet.has(c.p);
            if (!vis) {
                el.attr("opacity", 0);
                el.classed("eq-graph-focus-target", false);
                if (!c.p.isTarget) {
                    el.style("stroke-dasharray", null);
                }
                return;
            }
            el.attr("opacity", graphPathOpacityForCurve(c) ?? (c.p.hide ? 0 : null));
            /* Never paint the parametric EQ trace as the "target" line (gray); fallback targetP can equal eqP when the target dropdown is empty. */
            if (targetP && c.p === targetP && !c.p.isTarget && c.p !== eqP) {
                el.classed("eq-graph-focus-target", true);
                let spec = targetP.isTarget
                    ? targetTraceDotSpecForPhone(targetP)
                    : TARGET_TRACE_DOT_SPECS[0];
                let cap = spec.cap || "round";
                el.style("stroke-dasharray", spec.dash)
                    .attr("stroke-linecap", cap)
                    .attr("stroke-linejoin", cap === "round" ? "round" : "miter");
                el.attr("stroke-width", targetTraceStrokeWidthFromSpec(spec));
                if (typeof targetColorCustom !== "undefined" && targetColorCustom) {
                    el.attr("stroke", targetColorCustom);
                } else {
                    el.attr("stroke", "var(--background-color-contrast-more)");
                }
            } else {
                el.classed("eq-graph-focus-target", false);
                if (!c.p.isTarget) {
                    el.style("stroke-dasharray", null);
                    el.attr("stroke-linecap", null);
                    el.attr("stroke-linejoin", null);
                    el.attr("stroke", getColor_AC(c));
                } else {
                    applyTargetCurveStrokePattern(el, c.p);
                }
            }
        });
    };
    let filtersContainer = document.querySelector("div.extra-eq > div.filters");
    let fileFiltersImport = document.querySelector("#file-filters-import");
    let filterEnabledInput, filterTypeSelect,
        filterFreqInput, filterQInput, filterGainInput;
    let eqBands = extraEQBands;
    /* Until the user edits filter rows or drags graph nodes, graphic EQ may auto-sync rows from constraints. */
    let eqFiltersUserHasEdited = false;
    let eqFilterSelectedRow = null;
    /* Skip debounced history only for freq/gain/Q inputs while an EQ graph drag is active — those
       update continuously from the pointer; type / enable changes must still notify. */
    let eqHistorySkipNotifyForLiveGraphFilterInput = (t) => {
        let stPtr = eqGraphPointerState;
        return !!(stPtr && stPtr.mode === "eq" && stPtr.dragging && t && t.matches
            && t.matches("input[name='freq'], input[name='q'], input[name='gain']"));
    };
    if (filtersContainer) {
        filtersContainer.addEventListener("input", (e) => {
            let t = e.target;
            if (t && t.closest && filtersContainer.contains(t) && t.closest("div.filter")) {
                eqFiltersUserHasEdited = true;
                /* Type / band-enable use discrete history on `change` only; debounced notify here would
                   double-commit or coalesce with freq edits after MIN_GAP deferral. */
                if (t.matches && (t.matches("select[name='type']") || t.matches("input[name='enabled']"))) {
                    return;
                }
                if (!eqHistorySkipNotifyForLiveGraphFilterInput(t)) {
                    eqHistoryNotifyChange();
                }
            }
        }, true);
        filtersContainer.addEventListener("change", (e) => {
            let t = e.target;
            if (t && t.closest && filtersContainer.contains(t) && t.closest("div.filter")) {
                eqFiltersUserHasEdited = true;
                if (t.matches && (t.matches("select[name='type']") || t.matches("input[name='enabled']"))) {
                    if (t.matches("select[name='type']")) {
                        eqHistoryDebugLog("filtersContainer change (capture) type select", {
                            value: t.value,
                            activeEl: document.activeElement && document.activeElement.getAttribute
                                ? document.activeElement.getAttribute("name")
                                : null
                        });
                    }
                    /* History for type/enable is recorded from applyEQExec (runs after applyEQ), not here. */
                    return;
                }
                if (!eqHistorySkipNotifyForLiveGraphFilterInput(t)) {
                    eqHistoryNotifyChange();
                }
            }
        }, true);
        filtersContainer.addEventListener("focusin", (e) => {
            let t = e.target;
            if (!t || !t.matches || !t.matches("input[name='freq'], input[name='q'], input[name='gain'], select[name='type']")) {
                return;
            }
            if (!t.closest || !t.closest("div.filter") || !filtersContainer.contains(t.closest("div.filter"))) {
                return;
            }
            if (eqHistoryRestoring || eqHistoryChain.length > 0 || eqHistoryPendingPreEditSnap) {
                return;
            }
            eqHistoryPendingPreEditSnap = eqHistoryTakeSnapshot();
        }, true);
    }
    let updateEqFilterRowSelectionStyles = () => {
        if (!filtersContainer) {
            return;
        }
        filtersContainer.querySelectorAll("div.filter").forEach((el, i) => {
            el.classList.remove("eq-filter-row-selected", "eq-filter-row-dimmed");
            if (eqFilterSelectedRow === null) {
                return;
            }
            if (i === eqFilterSelectedRow) {
                el.classList.add("eq-filter-row-selected");
            }
        });
    };
    /* hoverHighlightRow: drag band or mouse-near marker; null = no pointer hover. */
    let applyEqFilterMarkerFillAndSize = (hoverHighlightRow) => {
        gEqFilterMarkers.selectAll("circle.eq-filter-marker").each(function (d) {
            if (!d) {
                return;
            }
            let c = d3.select(this);
            let hoverOn = hoverHighlightRow !== null && hoverHighlightRow !== undefined
                && d.rowIndex === hoverHighlightRow;
            let selOn = eqFilterSelectedRow !== null && d.rowIndex === eqFilterSelectedRow;
            let traceCol = c.attr("stroke");
            let strokeW = selOn
                ? EQ_GRAPH_MARKER_STROKE_W * EQ_GRAPH_MARKER_STROKE_HOVER_MULT
                : (hoverOn ? EQ_GRAPH_MARKER_STROKE_W * EQ_GRAPH_MARKER_STROKE_HOVER_MULT
                    : EQ_GRAPH_MARKER_STROKE_W);
            let rUse = selOn
                ? EQ_GRAPH_MARKER_R_BASE * EQ_GRAPH_MARKER_SEL_SCALE
                    * (hoverOn ? EQ_GRAPH_MARKER_SEL_HOVER_SCALE : 1)
                : EQ_GRAPH_MARKER_R_BASE * EQ_GRAPH_MARKER_UNSEL_SCALE
                    * (hoverOn ? EQ_GRAPH_MARKER_UNSEL_HOVER_SCALE : 1);
            c.classed("eq-filter-marker-hover", hoverOn)
                .classed("eq-filter-marker-selected", selOn)
                .attr("r", rUse)
                .attr("stroke-width", strokeW);
            if (selOn) {
                c.style("fill", eqMarkerResolvePaint(EQ_GRAPH_MARKER_SEL_FILL, traceCol))
                    .style("stroke", eqMarkerResolvePaint(EQ_GRAPH_MARKER_SEL_STROKE, traceCol));
            } else {
                if (EQ_GRAPH_MARKER_UNSEL_STROKE === "trace") {
                    c.style("stroke", null);
                } else {
                    c.style("stroke", eqMarkerResolvePaint(EQ_GRAPH_MARKER_UNSEL_STROKE, traceCol));
                }
                if (EQ_GRAPH_MARKER_UNSEL_FILL === "graph") {
                    c.attr("fill", null)
                        .style("fill", null);
                } else {
                    c.attr("fill", null)
                        .style("fill", eqMarkerResolvePaint(EQ_GRAPH_MARKER_UNSEL_FILL, traceCol));
                }
            }
        });
    };
    /* Gap below panel top when snapping extra-eq into view (scroll slightly less than flush). */
    const EQ_FILTER_SCROLL_EQ_TOP_INSET_PX = 10;
    /* If the filter row already fits in the panel, don’t smooth-scroll a few px just to nudge EQ inset. */
    const EQ_FILTER_SCROLL_IGNORE_INSET_NUDGE_PX = 28;
    let scrollEqFilterRowIntoView = (row) => {
        if (row === null || !filtersContainer) {
            return;
        }
        let tab = document.querySelector("div.select");
        if (!tab || tab.getAttribute("data-selected") !== "extra") {
            return;
        }
        let rows = filtersContainer.querySelectorAll("div.filter");
        let el = rows[row];
        if (!el) {
            return;
        }
        requestAnimationFrame(() => {
            let panel = document.querySelector("div.select > div.extra-panel");
            let eqRoot = filtersContainer.closest("div.extra-eq");
            if (panel && eqRoot) {
                let pr = panel.getBoundingClientRect();
                let deltaEq = eqRoot.getBoundingClientRect().top - pr.top
                    - EQ_FILTER_SCROLL_EQ_TOP_INSET_PX;
                let deltaRow = el.getBoundingClientRect().bottom - pr.bottom;
                let delta = Math.max(deltaEq, deltaRow);
                if (delta <= 0) {
                    return;
                }
                if (deltaRow <= 0 && delta < EQ_FILTER_SCROLL_IGNORE_INSET_NUDGE_PX) {
                    return;
                }
                let maxTop = Math.max(0, panel.scrollHeight - panel.clientHeight);
                let nextTop = Math.max(0, Math.min(maxTop, panel.scrollTop + delta));
                if (Math.abs(nextTop - panel.scrollTop) < 1) {
                    return;
                }
                panel.scrollTo({ top: nextTop, behavior: "smooth" });
            } else {
                el.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        });
    };
    let setEqFilterSelectedRow = (row, scrollBandIntoView) => {
        if (row !== null && (typeof row !== "number" || row < 0 || row >= eqBands)) {
            row = null;
        }
        eqFilterSelectedRow = row;
        updateEqFilterRowSelectionStyles();
        updateEqFilterMarkers();
        if (row !== null && scrollBandIntoView) {
            scrollEqFilterRowIntoView(row);
        }
    };
    window.hideExtraPanel = (selectedList) => {
        document.querySelector("div.select > div.selector-panel").style["display"] = "flex";
        document.querySelector("div.select > div.extra-panel").style["display"] = "none";
        document.querySelector("div.select").setAttribute("data-selected", selectedList);
        setEqFilterSelectedRow(null);
        syncEqHoverPreview(null);
        applyParametricEqGraphTraceFocus();
        updateEqTraceOpacity();
    };
    let parseEqConstraintGraphicFreqList = (raw) => {
        if (raw == null || typeof raw !== "string") {
            return [];
        }
        let s = raw.trim();
        if (s === "") {
            return [];
        }
        /* Trailing comma(s) while typing the next band (e.g. "32, 64,") would otherwise yield one token. */
        while (/(?:,|，)\s*$/.test(s)) {
            s = s.replace(/(?:,|，)\s*$/, "").trim();
        }
        if (s === "") {
            return [];
        }
        /* Comma must be followed by whitespace so "2,000" is not read as two bands. */
        let parts = s.split(/(?:,|，)\s+/);
        let out = [];
        let seen = new Set();
        for (let p of parts) {
            let t = p.trim();
            if (t === "") {
                continue;
            }
            if (/[,，]/.test(t)) {
                continue;
            }
            let v = Math.round(parseFloat(t));
            if (!Number.isFinite(v) || v < 20 || v > 20000) {
                continue;
            }
            if (!seen.has(v)) {
                seen.add(v);
                out.push(v);
            }
        }
        out.sort((a, b) => a - b);
        return out;
    };
    let isEqConstraintGraphicModeActive = () => {
        let bands = Equalizer.config.EqGraphicBandFreqHz;
        return Array.isArray(bands) && bands.length >= 2;
    };
    let applyEqConstraintFreqRowUiMode = () => {
        let row = document.querySelector("div.extra-eq .eq-constraint-freq-row");
        let par = document.querySelector("div.extra-eq .eq-constraint-freq-parametric-cells");
        let gf = document.querySelector("div.extra-eq .eq-constraint-freq-graphic-full");
        let gIn = document.querySelector("div.extra-eq input[name='eq-constraint-freq-graphic-list']");
        if (!row || !par || !gf || !gIn) {
            return;
        }
        let bands = Equalizer.config.EqGraphicBandFreqHz;
        let graphic = Array.isArray(bands) && bands.length >= 2;
        row.classList.toggle("eq-constraint-freq-row-graphic", graphic);
        par.hidden = graphic;
        gf.hidden = !graphic;
        if (graphic) {
            gIn.value = bands.join(", ");
        }
        applyEqGraphicModeAuxUiAndBands();
    };
    let clearEqConstraintGraphicFreqMode = () => {
        Equalizer.config.EqGraphicBandFreqHz = null;
        let g = document.querySelector("div.extra-eq input[name='eq-constraint-freq-graphic-list']");
        if (g) {
            g.value = "";
        }
        applyEqConstraintFreqRowUiMode();
    };
    let tryEnterEqConstraintGraphicFreqModeFromTyping = () => {
        let row = document.querySelector("div.extra-eq .eq-constraint-freq-row");
        let minEl = document.querySelector("div.extra-eq input[name='eq-constraint-freq-min']");
        let maxEl = document.querySelector("div.extra-eq input[name='eq-constraint-freq-max']");
        if (!row || !minEl || !maxEl || row.classList.contains("eq-constraint-freq-row-graphic")) {
            return false;
        }
        /* List lives in one field; that field is not "" / "0", so require only the *other* side unlimited. */
        let uVal = (s) => {
            let t = (s || "").trim();
            return t === "" || t === "0";
        };
        let minRaw = (minEl.value || "").trim();
        let maxRaw = (maxEl.value || "").trim();
        let hasGraphicCommaSpace = (s) => /(?:,|，)\s/.test(s);
        let minHasSep = hasGraphicCommaSpace(minRaw);
        let maxHasSep = hasGraphicCommaSpace(maxRaw);
        let rawPrefer = "";
        if (minHasSep) {
            if (!uVal(maxEl.value)) {
                return false;
            }
            rawPrefer = minEl.value;
        } else if (maxHasSep) {
            if (!uVal(minEl.value)) {
                return false;
            }
            rawPrefer = maxEl.value;
        } else {
            return false;
        }
        if (!rawPrefer) {
            return false;
        }
        let list = parseEqConstraintGraphicFreqList(rawPrefer);
        if (list.length < 2) {
            return false;
        }
        Equalizer.config.EqGraphicBandFreqHz = list.slice();
        Equalizer.config.AutoEQRange = [list[0], list[list.length - 1]];
        minEl.value = "0";
        maxEl.value = "0";
        applyEqConstraintFreqRowUiMode();
        requestAnimationFrame(() => {
            let gInAfter = document.querySelector("div.extra-eq input[name='eq-constraint-freq-graphic-list']");
            if (gInAfter) {
                gInAfter.focus();
                let n = gInAfter.value.length;
                gInAfter.setSelectionRange(n, n);
            }
        });
        return true;
    };
    let snapEqFilterFreqToGraphicBands = (hz) => {
        let bands = Equalizer.config.EqGraphicBandFreqHz;
        if (!bands || bands.length < 2 || !hz || hz <= 0) {
            return hz;
        }
        let best = bands[0];
        let bestScore = Infinity;
        for (let b of bands) {
            let s = Math.abs(Math.log(hz / b));
            if (s < bestScore) {
                bestScore = s;
                best = b;
            }
        }
        return best;
    };
    let getEqConstraintFreqLoHi = () => {
        let lo = Equalizer.config.AutoEQRange[0];
        let hi = Equalizer.config.AutoEQRange[1];
        if (!Number.isFinite(lo)) {
            lo = 20;
        }
        if (!Number.isFinite(hi)) {
            hi = 20000;
        }
        lo = Math.min(20000, Math.max(20, lo));
        hi = Math.min(20000, Math.max(20, hi));
        if (lo > hi) {
            let t = lo;
            lo = hi;
            hi = t;
        }
        return [lo, hi];
    };
    let getEqConstraintQLoHi = () => {
        let lo = Equalizer.config.OptimizeQRange[0];
        let hi = Equalizer.config.OptimizeQRange[1];
        if (!Number.isFinite(lo)) {
            lo = 0.1;
        }
        if (!Number.isFinite(hi)) {
            hi = 10;
        }
        lo = Math.min(10, Math.max(0.1, lo));
        hi = Math.min(10, Math.max(0.1, hi));
        if (lo > hi) {
            let t = lo;
            lo = hi;
            hi = t;
        }
        return [lo, hi];
    };
    let getEqConstraintGainLoHi = () => {
        let lo = Equalizer.config.OptimizeGainRange[0];
        let hi = Equalizer.config.OptimizeGainRange[1];
        if (!Number.isFinite(lo)) {
            lo = -40;
        }
        if (!Number.isFinite(hi)) {
            hi = 40;
        }
        lo = Math.min(40, Math.max(-40, lo));
        hi = Math.min(40, Math.max(-40, hi));
        if (lo > hi) {
            let t = lo;
            lo = hi;
            hi = t;
        }
        return [lo, hi];
    };
    /* Mid-edit numeric strings (e.g. "0." before "1") — don’t rewrite the field or snap config from them. */
    let eqConstraintNumericInputIncomplete = (raw) => {
        if (raw == null) {
            return false;
        }
        let s = String(raw);
        if (/[eE]$/.test(s)) {
            return true;
        }
        if (/\.$/.test(s)) {
            return true;
        }
        let t = s.trim();
        return t === "-" || t === "+" || t === "-." || t === ".";
    };
    let getEffectiveEqMaxBands = () => {
        let n = Math.floor(Number(Equalizer.config.EqMaxBands));
        if (!Number.isFinite(n) || n <= 0) {
            return extraEQBandsMax;
        }
        return Math.min(Math.max(1, n), extraEQBandsMax);
    };
    let firstAllowedEqFilterType = () => {
        let a = Equalizer.config.EqAllowedTypes || {};
        if (a.PK) {
            return "PK";
        }
        if (a.LSQ) {
            return "LSQ";
        }
        if (a.HSQ) {
            return "HSQ";
        }
        return "PK";
    };
    let refreshEqFilterInactiveStateForMaxBands = () => {
        if (!filtersContainer) {
            return;
        }
        let maxA = getEffectiveEqMaxBands();
        filtersContainer.querySelectorAll("div.filter").forEach((row, i) => {
            let inactive = i >= maxA;
            row.classList.toggle("eq-filter-row-inactive", inactive);
            row.querySelectorAll("input, select").forEach((el) => {
                el.disabled = inactive;
            });
        });
    };
    let applyEqConstraintAttributesToFilterInputs = () => {
        if (!filterFreqInput || !filterFreqInput.length) {
            return;
        }
        let [fLo, fHi] = getEqConstraintFreqLoHi();
        let [qLo, qHi] = getEqConstraintQLoHi();
        let [gLo, gHi] = getEqConstraintGainLoHi();
        let allowed = Equalizer.config.EqAllowedTypes || { PK: true, LSQ: true, HSQ: true };
        for (let i = 0; i < eqBands; i++) {
            let fi = filterFreqInput[i];
            let qi = filterQInput[i];
            let gi = filterGainInput[i];
            let si = filterTypeSelect[i];
            if (fi) {
                fi.setAttribute("min", String(fLo));
                fi.setAttribute("max", String(fHi));
            }
            if (qi) {
                qi.setAttribute("min", String(qLo));
                qi.setAttribute("max", String(qHi));
            }
            if (gi) {
                gi.setAttribute("min", String(gLo));
                gi.setAttribute("max", String(gHi));
            }
            if (si) {
                si.querySelectorAll("option").forEach((opt) => {
                    let v = opt.value;
                    let ok = (v === "PK" && allowed.PK) || (v === "LSQ" && allowed.LSQ)
                        || (v === "HSQ" && allowed.HSQ);
                    opt.disabled = !ok;
                });
            }
        }
    };
    const EQ_CONSTRAINT_Q_FINE_MAX = 0.3;
    let refreshEqFilterConstraintViolationStyles = () => {
        if (!filterFreqInput || !filterFreqInput.length) {
            return;
        }
        let [fLo, fHi] = getEqConstraintFreqLoHi();
        let [qLo, qHi] = getEqConstraintQLoHi();
        let [gLo, gHi] = getEqConstraintGainLoHi();
        let allowed = Equalizer.config.EqAllowedTypes || { PK: true, LSQ: true, HSQ: true };
        let maxA = getEffectiveEqMaxBands();
        let vClass = "eq-filter-value-constraint-violation";
        for (let i = 0; i < eqBands; i++) {
            let fi = filterFreqInput[i];
            let qi = filterQInput[i];
            let gi = filterGainInput[i];
            let si = filterTypeSelect[i];
            [fi, qi, gi, si].forEach((el) => {
                if (el) {
                    el.classList.remove(vClass);
                }
            });
            if (i >= maxA) {
                continue;
            }
            let f = parseInt(fi.value, 10) || 0;
            let q = parseFloat(qi.value) || 0;
            let g = parseFloat(gi.value) || 0;
            let emptyish = f === 0 && q === 0 && g === 0;
            if (!emptyish) {
                let bands = Equalizer.config.EqGraphicBandFreqHz;
                let graphicFreq = Array.isArray(bands) && bands.length >= 2;
                if (f !== 0) {
                    if (graphicFreq) {
                        let onBand = bands.some((b) => Math.abs(b - f) < 0.51);
                        if (!onBand) {
                            fi.classList.add(vClass);
                        }
                    } else if (f < fLo || f > fHi) {
                        fi.classList.add(vClass);
                    }
                }
                let qStrictRange = graphicFreq && eqFiltersUserHasEdited;
                let qBad = qStrictRange
                    ? (q < qLo || q > qHi)
                    : (q !== 0 && (q < qLo || q > qHi));
                if (qBad) {
                    qi.classList.add(vClass);
                }
                if ((g !== 0 || f !== 0 || q !== 0) && (g < gLo || g > gHi)) {
                    gi.classList.add(vClass);
                }
            }
            let sel = si.value;
            if (!allowed[sel]) {
                si.classList.add(vClass);
            }
        }
    };
    let updateFilterElements = () => {
        if (!filtersContainer) {
            return;
        }
        let node = filtersContainer.querySelector("div.filter");
        while (filtersContainer.childElementCount < eqBands) {
            let clone = node.cloneNode(true);
            clone.querySelector("input[name='enabled']").value = "true";
            clone.querySelector("select[name='type']").value = "PK";
            clone.querySelector("input[name='freq']").value = "0";
            clone.querySelector("input[name='q']").value = "0";
            clone.querySelector("input[name='gain']").value = "0";
            filtersContainer.appendChild(clone);
        }
        while (filtersContainer.childElementCount > eqBands) {
            filtersContainer.children[filtersContainer.childElementCount-1].remove();
        }
        filterEnabledInput = filtersContainer.querySelectorAll("input[name='enabled']");
        filterTypeSelect = filtersContainer.querySelectorAll("select[name='type']");
        filterFreqInput = filtersContainer.querySelectorAll("input[name='freq']");
        filterQInput = filtersContainer.querySelectorAll("input[name='q']");
        filterGainInput = filtersContainer.querySelectorAll("input[name='gain']");
        filtersContainer.querySelectorAll("input,select").forEach((el) => {
            el.removeEventListener("input", applyEQ);
            el.removeEventListener("change", applyEQ);
            el.addEventListener("input", applyEQ);
            el.addEventListener("change", applyEQ);
        });
        if (eqFilterSelectedRow !== null
                && eqFilterSelectedRow >= filtersContainer.querySelectorAll("div.filter").length) {
            eqFilterSelectedRow = null;
        }
        updateEqFilterRowSelectionStyles();
        applyEqConstraintAttributesToFilterInputs();
        refreshEqFilterConstraintViolationStyles();
        refreshEqFilterInactiveStateForMaxBands();
    };
    let elemToFilters = (includeAll) => {
        // Collect filters from ui
        let filters = [];
        let maxA = getEffectiveEqMaxBands();
        for (let i = 0; i < eqBands; ++i) {
            if (!includeAll && i >= maxA) {
                continue;
            }
            let disabled = !filterEnabledInput[i].checked;
            let type = filterTypeSelect[i].value;
            let freq = parseInt(filterFreqInput[i].value) || 0;
            let q = parseFloat(filterQInput[i].value) || 0;
            let gain = parseFloat(filterGainInput[i].value) || 0;
            if (!includeAll && (disabled || !type || !freq || !q || !gain)) {
                continue;
            }
            filters.push({ disabled, type, freq, q, gain });
        }
        return filters;
    };
    /* Clamp to Equalizer.config ranges for audio / export only; never mutates DOM. */
    let elemToFiltersClampedRowsForEqualizerApply = (raw, includeAll) => {
        let [fLo, fHi] = getEqConstraintFreqLoHi();
        let [qLo, qHi] = getEqConstraintQLoHi();
        let [gLo, gHi] = getEqConstraintGainLoHi();
        let allowed = Equalizer.config.EqAllowedTypes || { PK: true, LSQ: true, HSQ: true };
        return raw.map((f) => {
            let type = allowed[f.type] ? f.type : firstAllowedEqFilterType();
            let freq = f.freq ? Math.min(fHi, Math.max(fLo, f.freq)) : 0;
            if (freq) {
                freq = snapEqFilterFreqToGraphicBands(freq);
            }
            let q = f.q ? (() => {
                let qc = Math.min(qHi, Math.max(qLo, f.q));
                return qc <= EQ_CONSTRAINT_Q_FINE_MAX + 1e-9
                    ? Math.round(qc * 100) / 100
                    : Math.round(qc * 10) / 10;
            })() : 0;
            let gain = (f.gain !== 0 || f.freq || f.q)
                ? Math.round(Math.min(gHi, Math.max(gLo, f.gain)) * 10) / 10
                : 0;
            return { ...f, type, freq, q, gain };
        });
    };
    let elemToFiltersClampedForEqualizerApply = (includeAll) =>
        elemToFiltersClampedRowsForEqualizerApply(elemToFilters(includeAll), includeAll);
    let filtersToElem = (filters) => {
        // Set filters to ui
        let filtersCopy = filters.map(f => f);
        while (filtersCopy.length < eqBands) {
            filtersCopy.push({ type: "PK", freq: 0, q: 0, gain: 0 });
        }
        if (filtersCopy.length > eqBands) {
            eqBands = Math.min(filtersCopy.length, extraEQBandsMax);
            filtersCopy = filtersCopy.slice(0, eqBands);
            updateFilterElements();
        }
        filtersCopy.forEach((f, i) => {
            filterEnabledInput[i].checked = !f.disabled;
            filterTypeSelect[i].value = f.type;
            filterFreqInput[i].value = f.freq;
            filterQInput[i].value = f.q;
            filterGainInput[i].value = f.gain;
        });
        eqFiltersUserHasEdited = true;
        applyEqConstraintAttributesToFilterInputs();
        refreshEqFilterConstraintViolationStyles();
        refreshEqFilterInactiveStateForMaxBands();
        if (isEqTwoChannelSupportEnabled()) {
            eq2chBankData[eq2chActiveBank] = filtersCopy.map((f) => ({
                disabled: !!f.disabled,
                type: f.type,
                freq: f.freq,
                q: f.q,
                gain: f.gain
            }));
        }
    };
    let eq2chConstraintToggle = document.querySelector("input.eq-constraint-2ch-toggle");
    let eq2chBankTabsEl = document.getElementById("eq-2ch-bank-tabs");
    let eq2chBankData = { both: [], L: [], R: [] };
    let eq2chActiveBank = "both";
    const EQ_2CH_BANK_SWAP_ANIM_MS = 300;
    const EQ_2CH_BANK_SWAP_APPLY_AT_MS = 95;
    let eq2chBankSwapSeq = 0;
    let eq2chBankSwapApplyTimer = null;
    let eq2chBankSwapCleanupTimer = null;
    let eq2chBankSwapAnimEndFn = null;
    let clearEq2chBankSwapAnimation = () => {
        if (eq2chBankSwapApplyTimer !== null) {
            clearTimeout(eq2chBankSwapApplyTimer);
            eq2chBankSwapApplyTimer = null;
        }
        if (eq2chBankSwapCleanupTimer !== null) {
            clearTimeout(eq2chBankSwapCleanupTimer);
            eq2chBankSwapCleanupTimer = null;
        }
        if (filtersContainer && eq2chBankSwapAnimEndFn) {
            filtersContainer.removeEventListener("animationend", eq2chBankSwapAnimEndFn);
            eq2chBankSwapAnimEndFn = null;
        }
        if (filtersContainer) {
            filtersContainer.classList.remove("eq-2ch-bank-filters-swap-anim");
        }
    };
    let isEqTwoChannelSupportEnabled = () =>
        !!(eq2chConstraintToggle && eq2chConstraintToggle.checked);
    let eq2chDefaultEmptyRow = () => ({
        disabled: false,
        type: "PK",
        freq: 0,
        q: 0,
        gain: 0
    });
    let eq2chPadBankToEqBands = (arr) => {
        let filtersCopy = (arr || []).map((f) => ({ ...f }));
        while (filtersCopy.length < eqBands) {
            filtersCopy.push(eq2chDefaultEmptyRow());
        }
        if (filtersCopy.length > eqBands) {
            filtersCopy.length = eqBands;
        }
        return filtersCopy;
    };
    let eq2chFlushDomToActiveBankCore = () => {
        eq2chBankData[eq2chActiveBank] = elemToFilters(true).map((f) => ({
            disabled: !!f.disabled,
            type: f.type,
            freq: f.freq,
            q: f.q,
            gain: f.gain
        }));
    };
    let eq2chFlushDomToActiveBank = () => {
        if (!isEqTwoChannelSupportEnabled()) {
            return;
        }
        eq2chFlushDomToActiveBankCore();
    };
    /* --- EQ undo / redo history (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z, Cmd/Ctrl+Y) --- */
    let eqHistoryChain = [];
    let eqHistoryHead = -1;
    let eqHistoryRestoring = false;
    let eqHistoryDebounceTimer = null;
    let eqHistoryGapWaitTimer = null;
    let eqHistoryLastCommitAt = 0;
    let eqHistoryTimeTicker = null;
    let eqHistoryListClickBound = false;
    /** Pinned change-history body (one at a time); ghost trace on graph. Cleared on EQ model switch. */
    let eqPinnedSnapshotBody = null;
    let eqHistoryPendingPreEditSnap = null;
    let eqHistoryInitBaselineSnap = null;
    const EQ_HISTORY_CAP = 100;
    const EQ_HISTORY_DEBOUNCE_MS = 500;
    const EQ_HISTORY_MIN_GAP_MS = 1000;
    /* Set `window.__EQ_HISTORY_DEBUG = true` in the console to trace EQ change history (filter type, push, skips). */
    let eqHistoryDebugLog = (...a) => {
        if (typeof window !== "undefined" && window.__EQ_HISTORY_DEBUG) {
            console.log("[EQ hist]", ...a);
        }
    };
    /* applyEQExec compares this to DOM so filter type / band-enable edits always log even if <select>
       change events never reach our listeners (iframes, shadow roots, UA quirks). */
    let eqHistoryLastApplyTypeEnableSig = null;
    let eqHistoryCaptureTypeEnableSigFromDom = () => {
        if (!filterTypeSelect || !filterTypeSelect.length || !filterEnabledInput || !filterEnabledInput.length) {
            return null;
        }
        let parts = [];
        for (let i = 0; i < eqBands; i++) {
            let cb = filterEnabledInput[i];
            let sel = filterTypeSelect[i];
            if (!cb || !sel) {
                parts.push("?:?");
                continue;
            }
            parts.push((cb.checked ? 1 : 0) + ":" + String(sel.value || ""));
        }
        return parts.join("|");
    };
    let eqHistoryEmptyRow = () => ({
        disabled: false,
        type: "PK",
        freq: 0,
        q: 0,
        gain: 0
    });
    let eqHistoryCloneRow = (r) => ({
        disabled: !!r.disabled,
        type: r.type,
        freq: +r.freq || 0,
        q: +r.q || 0,
        gain: +r.gain || 0
    });
    let eqHistoryCloneBank = (arr) => (arr || []).map(eqHistoryCloneRow);
    let eqHistoryTakeSnapshot = (meta) => {
        eq2chFlushDomToActiveBank();
        let rows = elemToFilters(true).map(eqHistoryCloneRow);
        let banks = isEqTwoChannelSupportEnabled() ? {
            both: eqHistoryCloneBank(eq2chBankData.both),
            L: eqHistoryCloneBank(eq2chBankData.L),
            R: eqHistoryCloneBank(eq2chBankData.R)
        } : null;
        let out = {
            bandCount: eqBands,
            twoCh: isEqTwoChannelSupportEnabled(),
            activeBank: eq2chActiveBank,
            banks,
            rows,
            savedAt: Date.now()
        };
        if (meta && meta.historyEntry && meta.historyEntry.kind) {
            out.historyEntry = { kind: String(meta.historyEntry.kind) };
            if (meta.historyEntry.removeFreq != null && Number.isFinite(+meta.historyEntry.removeFreq)) {
                out.historyEntry.removeFreq = +meta.historyEntry.removeFreq;
            }
        }
        return out;
    };
    let eqHistoryRowEqual = (a, b) => !!a && !!b
        && !!a.disabled === !!b.disabled
        && a.type === b.type
        && (+a.freq || 0) === (+b.freq || 0)
        && Math.abs((+a.q || 0) - (+b.q || 0)) < 1e-6
        && Math.abs((+a.gain || 0) - (+b.gain || 0)) < 1e-6;
    let eqHistoryRowsEqualArr = (ra, rb) => {
        let n = Math.max(ra.length, rb.length);
        for (let i = 0; i < n; i++) {
            let a = ra[i] || eqHistoryEmptyRow();
            let b = rb[i] || eqHistoryEmptyRow();
            if (!eqHistoryRowEqual(a, b)) {
                return false;
            }
        }
        return true;
    };
    let eqHistoryEntryKey = (s) => {
        if (!s || !s.historyEntry || !s.historyEntry.kind) {
            return "";
        }
        return String(s.historyEntry.kind);
    };
    let eqHistorySnapDataEqual = (a, b) => {
        if (!a || !b) {
            return false;
        }
        if (eqHistoryEntryKey(a) !== eqHistoryEntryKey(b)) {
            return false;
        }
        if (a.bandCount !== b.bandCount || !!a.twoCh !== !!b.twoCh) {
            return false;
        }
        if (a.activeBank !== b.activeBank) {
            return false;
        }
        if (a.twoCh && b.twoCh && a.banks && b.banks) {
            return ["both", "L", "R"].every((k) =>
                eqHistoryRowsEqualArr(a.banks[k] || [], b.banks[k] || []));
        }
        return eqHistoryRowsEqualArr(a.rows || [], b.rows || []);
    };
    /* Same as eqHistorySnapDataEqual but ignores historyEntry (for pin vs chain row). */
    let eqHistorySnapshotBodyEqual = (a, b) => {
        if (!a || !b) {
            return false;
        }
        if (a.bandCount !== b.bandCount || !!a.twoCh !== !!b.twoCh) {
            return false;
        }
        if (a.activeBank !== b.activeBank) {
            return false;
        }
        if (a.twoCh && b.twoCh && a.banks && b.banks) {
            return ["both", "L", "R"].every((k) =>
                eqHistoryRowsEqualArr(a.banks[k] || [], b.banks[k] || []));
        }
        return eqHistoryRowsEqualArr(a.rows || [], b.rows || []);
    };
    let eqHistoryCloneSnapshotBody = (snap) => {
        if (!snap) {
            return null;
        }
        return {
            bandCount: snap.bandCount,
            twoCh: !!snap.twoCh,
            activeBank: snap.activeBank,
            rows: eqHistoryCloneBank(snap.rows || []),
            banks: snap.banks ? {
                both: eqHistoryCloneBank(snap.banks.both || []),
                L: eqHistoryCloneBank(snap.banks.L || []),
                R: eqHistoryCloneBank(snap.banks.R || [])
            } : null
        };
    };
    let eqHistoryRowEmpty = (r) => {
        let x = r || eqHistoryEmptyRow();
        return !(+x.freq || 0) && !(+x.q || 0) && !(+x.gain || 0);
    };
    let eqHistoryPadSnapRows = (snap, minLen) => {
        let rows = (snap.rows || []).map(eqHistoryCloneRow);
        let n = Math.max(minLen || 0, snap.bandCount || 0, rows.length);
        let out = [];
        for (let i = 0; i < n; i++) {
            out.push(rows[i] ? eqHistoryCloneRow(rows[i]) : eqHistoryEmptyRow());
        }
        return out;
    };
    let eqHistoryFormatHz = (hz) => {
        let n = Math.round(+hz || 0);
        if (!n) {
            return "—";
        }
        return `${n}Hz`;
    };
    let eqHistoryFormatGain = (g) => {
        let v = Math.round((+g || 0) * 10) / 10;
        return `${v}dB`;
    };
    let eqHistoryFormatQ = (q) => {
        let v = Math.round((+q || 0) * 100) / 100;
        return `${v} Q`;
    };
    /** One row in the history log: prev → next (snapshots); baseline when prev is null. */
    let eqHistoryDescribeTransition = (prev, next) => {
        if (!next) {
            return {
                iconKind: "plus",
                startFreq: "—",
                middle: ""
            };
        }
        if (next.historyEntry && next.historyEntry.kind === "reset") {
            return {
                iconKind: "reset",
                startFreq: "Reset",
                middle: ""
            };
        }
        if (next.historyEntry && next.historyEntry.kind === "autoeq") {
            return {
                iconKind: "autoeq",
                startFreq: "Auto",
                middle: ""
            };
        }
        if (next.historyEntry && next.historyEntry.kind === "removeBand") {
            let rf = next.historyEntry.removeFreq;
            return {
                iconKind: "delete",
                startFreq: eqHistoryFormatHz(rf),
                middle: ""
            };
        }
        if (!prev) {
            let rows = eqHistoryPadSnapRows(next, next.bandCount || 0);
            let firstHz = 0;
            for (let i = 0; i < rows.length; i++) {
                if (+rows[i].freq > 0) {
                    firstHz = +rows[i].freq;
                    break;
                }
            }
            return {
                iconKind: "plus",
                startFreq: eqHistoryFormatHz(firstHz),
                middle: ""
            };
        }
        let n = Math.max(
            prev.bandCount || 0,
            next.bandCount || 0,
            (prev.rows || []).length,
            (next.rows || []).length
        );
        let pr = eqHistoryPadSnapRows(prev, n);
        let nx = eqHistoryPadSnapRows(next, n);
        let pick = null;
        for (let i = 0; i < n; i++) {
            let a = pr[i];
            let b = nx[i];
            let aE = eqHistoryRowEmpty(a);
            let bE = eqHistoryRowEmpty(b);
            if (aE && bE) {
                if (eqHistoryRowEqual(a, b)) {
                    continue;
                }
                pick = { kind: "change", i, a, b };
                break;
            }
            if (aE && !bE) {
                pick = { kind: "create", i, a, b };
                break;
            }
            if (!aE && bE) {
                pick = { kind: "delete", i, a, b };
                break;
            }
            if (!eqHistoryRowEqual(a, b)) {
                pick = { kind: "change", i, a, b };
                break;
            }
        }
        if (!pick) {
            if (prev.bandCount !== next.bandCount || !!prev.twoCh !== !!next.twoCh
                    || prev.activeBank !== next.activeBank) {
                return {
                    iconKind: "change",
                    startFreq: "—",
                    middle: ""
                };
            }
            return {
                iconKind: "change",
                startFreq: "—",
                middle: ""
            };
        }
        if (pick.kind === "create") {
            return {
                iconKind: "plus",
                startFreq: eqHistoryFormatHz(pick.b.freq),
                middle: ""
            };
        }
        if (pick.kind === "delete") {
            return {
                iconKind: "delete",
                startFreq: eqHistoryFormatHz(pick.a.freq),
                middle: ""
            };
        }
        let a = pick.a;
        let b = pick.b;
        let middle = "";
        if (a.type !== b.type) {
            middle = String(b.type || "");
        } else if ((+a.freq || 0) !== (+b.freq || 0)) {
            middle = eqHistoryFormatHz(b.freq);
        } else if (Math.abs((+a.gain || 0) - (+b.gain || 0)) > 1e-6) {
            middle = eqHistoryFormatGain(b.gain);
        } else if (Math.abs((+a.q || 0) - (+b.q || 0)) > 1e-6) {
            middle = eqHistoryFormatQ(b.q);
        } else if (!!a.disabled !== !!b.disabled) {
            middle = b.disabled ? "Off" : "On";
        }
        return {
            iconKind: "change",
            startFreq: eqHistoryFormatHz(a.freq),
            middle
        };
    };
    let eqHistorySvgChange = () => (
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"extra-eq-change-history-svg extra-eq-change-history-svg-stroke\" aria-hidden=\"true\">"
        + "<path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />"
        + "<path d=\"M5 12h.5m3 0h1.5m3 0h6\" />"
        + "<path d=\"M15 16l4 -4\" />"
        + "<path d=\"M15 8l4 4\" />"
        + "</svg>"
    );
    let eqHistorySvgReset = () => (
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"extra-eq-change-history-svg extra-eq-change-history-svg-stroke\" aria-hidden=\"true\">"
        + "<path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />"
        + "<path d=\"M9 14l-4 -4l4 -4\" />"
        + "<path d=\"M5 10h11a4 4 0 1 1 0 8h-1\" />"
        + "</svg>"
    );
    let eqHistorySvgAutoEq = () => (
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\" class=\"extra-eq-change-history-svg\" aria-hidden=\"true\">"
        + "<path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />"
        + "<path d=\"M16 19a1 1 0 0 1 0 -2a1 1 0 0 0 1 -1c0 -1.333 2 -1.333 2 0a1 1 0 0 0 1 1c1.333 0 1.333 2 0 2a1 1 0 0 0 -1 1c0 1.333 -2 1.333 -2 0a1 1 0 0 0 -1 -1\" />"
        + "<path d=\"M3 11a5 5 0 0 0 5 -5c0 -1.333 2 -1.333 2 0a5 5 0 0 0 5 5c1.333 0 1.333 2 0 2a5 5 0 0 0 -5 5a1 1 0 0 1 -2 0a5 5 0 0 0 -5 -5c-1.333 0 -1.333 -2 0 -2\" />"
        + "<path d=\"M16 7a1 1 0 0 1 0 -2a1 1 0 0 0 1 -1c0 -1.333 2 -1.333 2 0a1 1 0 0 0 1 1c1.333 0 1.333 2 0 2a1 1 0 0 0 -1 1c0 1.333 -2 1.333 -2 0a1 1 0 0 0 -1 -1\" />"
        + "</svg>"
    );
    let eqHistoryRowIconHtml = (iconKind) => {
        if (iconKind === "plus") {
            return "<span class=\"extra-eq-change-history-icon-plus-mask\" aria-hidden=\"true\"></span>";
        }
        if (iconKind === "delete") {
            return "<span class=\"extra-eq-change-history-icon-plus-mask extra-eq-change-history-icon-plus-mask--rot45\" aria-hidden=\"true\"></span>";
        }
        if (iconKind === "reset") {
            return eqHistorySvgReset();
        }
        if (iconKind === "autoeq") {
            return eqHistorySvgAutoEq();
        }
        return eqHistorySvgChange();
    };
    let eqHistoryClearTimers = () => {
        if (eqHistoryDebounceTimer !== null) {
            clearTimeout(eqHistoryDebounceTimer);
            eqHistoryDebounceTimer = null;
        }
        if (eqHistoryGapWaitTimer !== null) {
            clearTimeout(eqHistoryGapWaitTimer);
            eqHistoryGapWaitTimer = null;
        }
    };
    let eqHistoryTrimToCap = () => {
        while (eqHistoryChain.length > EQ_HISTORY_CAP) {
            eqHistoryChain.shift();
            eqHistoryHead = Math.max(0, eqHistoryHead - 1);
        }
    };
    let eqHistoryFormatCompactAge = (ts) => {
        let sec = (Date.now() - ts) / 1000;
        if (!Number.isFinite(sec) || sec < 0) {
            return "—";
        }
        if (sec < 60) {
            return `${Math.max(0, Math.round(sec))}s`;
        }
        let min = sec / 60;
        if (min < 60) {
            return `${Math.round(min)}m`;
        }
        let hr = sec / 3600;
        if (hr < 24) {
            return `${Math.round(hr)}h`;
        }
        return `${Math.round(sec / 86400)}d`;
    };
    let eqHistoryRefreshTimeLabels = () => {
        let list = document.getElementById("extra-eq-change-history-list");
        if (!list) {
            return;
        }
        list.querySelectorAll("[data-eq-history-at]").forEach((el) => {
            let ts = Number(el.getAttribute("data-eq-history-at"));
            el.textContent = eqHistoryFormatCompactAge(ts);
        });
    };
    let eqHistoryMaybeStartTicker = () => {
        if (!extraEQEnabled || eqHistoryTimeTicker !== null) {
            return;
        }
        eqHistoryTimeTicker = setInterval(() => {
            if (!extraEQEnabled) {
                clearInterval(eqHistoryTimeTicker);
                eqHistoryTimeTicker = null;
                return;
            }
            eqHistoryRefreshTimeLabels();
        }, 1000);
    };
    let eqHistoryBindListOnce = () => {
        let list = document.getElementById("extra-eq-change-history-list");
        if (!list || eqHistoryListClickBound) {
            return;
        }
        eqHistoryListClickBound = true;
        list.addEventListener("click", (e) => {
            let row = e.target && e.target.closest && e.target.closest("[data-eq-history-idx]");
            if (!row || !list.contains(row)) {
                return;
            }
            let ix = parseInt(row.getAttribute("data-eq-history-idx"), 10);
            if (!Number.isFinite(ix) || ix < 0 || ix >= eqHistoryChain.length) {
                return;
            }
            if (e.target.closest(".extra-eq-change-history-col-pin")) {
                let body = eqHistoryCloneSnapshotBody(eqHistoryChain[ix]);
                if (eqPinnedSnapshotBody && eqHistorySnapshotBodyEqual(eqPinnedSnapshotBody, body)) {
                    eqPinnedSnapshotBody = null;
                } else {
                    eqPinnedSnapshotBody = body;
                }
                eqHistoryRenderLog();
                updateEqFilterMarkers();
                scheduleLiveEqSync();
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            eqHistoryHead = ix;
            eqHistoryRestore(eqHistoryChain[ix]);
        }, true);
    };
    let eqHistoryRenderLog = () => {
        let list = document.getElementById("extra-eq-change-history-list");
        if (!list || !extraEQEnabled) {
            return;
        }
        eqHistoryBindListOnce();
        eqHistoryMaybeStartTicker();
        list.replaceChildren();
        if (!eqHistoryChain.length) {
            let empty = document.createElement("div");
            empty.className = "extra-eq-change-history-empty";
            empty.textContent = "Edits will appear here after you change the EQ.";
            list.appendChild(empty);
            return;
        }
        for (let i = eqHistoryChain.length - 1; i >= 0; i--) {
            let snap = eqHistoryChain[i];
            let prevSnap = i > 0 ? eqHistoryChain[i - 1] : null;
            let desc = i === 0
                ? eqHistoryDescribeTransition(null, snap)
                : eqHistoryDescribeTransition(prevSnap, snap);
            let row = document.createElement("button");
            row.type = "button";
            let stateClass = i === eqHistoryHead ? "extra-eq-change-history-row--current"
                : (i < eqHistoryHead ? "extra-eq-change-history-row--past"
                    : "extra-eq-change-history-row--future");
            row.className = "extra-eq-change-history-row " + stateClass;
            let pinBody = eqHistoryCloneSnapshotBody(snap);
            let isCurrent = i === eqHistoryHead;
            let rowPinned = !!(eqPinnedSnapshotBody && eqHistorySnapshotBodyEqual(eqPinnedSnapshotBody, pinBody));
            if (rowPinned) {
                row.className += " extra-eq-change-history-row--pinned";
            }
            let showPinSlot = isCurrent || rowPinned;
            row.setAttribute("data-eq-history-idx", String(i));
            row.setAttribute("role", "listitem");
            let pinCol = document.createElement("span");
            pinCol.className = "extra-eq-change-history-col";
            if (showPinSlot) {
                pinCol.className += " extra-eq-change-history-col-pin";
                if (rowPinned) {
                    pinCol.innerHTML = "<span class=\"extra-eq-change-history-pin-ab extra-eq-change-history-pin-ab--filled\" aria-hidden=\"true\"><span class=\"extra-eq-change-history-pin-ab-letter\">A</span></span>";
                    pinCol.title = "Unpin";
                } else {
                    pinCol.classList.add("extra-eq-change-history-col-pin--outline");
                    pinCol.innerHTML = "<span class=\"extra-eq-change-history-pin-ab extra-eq-change-history-pin-ab--outline\" aria-hidden=\"true\"><span class=\"extra-eq-change-history-pin-ab-letter\">A</span></span>";
                    pinCol.title = "Pin this state (unequalized trace shows this EQ)";
                }
            } else {
                pinCol.className += " extra-eq-change-history-col-pin-reserved";
                pinCol.setAttribute("aria-hidden", "true");
            }
            let freqEl = document.createElement("span");
            freqEl.className = "extra-eq-change-history-col extra-eq-change-history-col-freq";
            freqEl.textContent = desc.startFreq;
            let iconWrap = document.createElement("span");
            iconWrap.className = "extra-eq-change-history-col extra-eq-change-history-col-icon";
            iconWrap.innerHTML = eqHistoryRowIconHtml(desc.iconKind);
            let midEl = document.createElement("span");
            midEl.className = "extra-eq-change-history-col extra-eq-change-history-col-delta";
            midEl.textContent = desc.middle || "";
            let timeEl = document.createElement("span");
            timeEl.className = "extra-eq-change-history-col extra-eq-change-history-col-time";
            if (Number.isFinite(snap.savedAt)) {
                timeEl.setAttribute("data-eq-history-at", String(snap.savedAt));
                timeEl.textContent = eqHistoryFormatCompactAge(snap.savedAt);
            } else {
                timeEl.textContent = "—";
            }
            row.appendChild(pinCol);
            row.appendChild(freqEl);
            row.appendChild(iconWrap);
            row.appendChild(midEl);
            row.appendChild(timeEl);
            list.appendChild(row);
        }
    };
    let eqHistoryRestore = (snap) => {
        if (!snap || !filtersContainer) {
            return;
        }
        eqHistoryRestoring = true;
        try {
            if (snap.bandCount !== eqBands) {
                eqBands = snap.bandCount;
                updateFilterElements();
            }
            if (isEqTwoChannelSupportEnabled() && snap.banks) {
                eq2chBankData.both = eqHistoryCloneBank(snap.banks.both);
                eq2chBankData.L = eqHistoryCloneBank(snap.banks.L);
                eq2chBankData.R = eqHistoryCloneBank(snap.banks.R);
                let ab = snap.activeBank;
                eq2chActiveBank = (ab === "L" || ab === "R" || ab === "both") ? ab : "both";
                eq2chSyncBankTabStyles();
                filtersToElem(eq2chPadBankToEqBands(eq2chBankData[eq2chActiveBank]));
            } else {
                filtersToElem(eq2chPadBankToEqBands(snap.rows));
            }
            cancelDeferredApplyEQ();
            applyEQExec();
            scheduleLiveEqSync();
            applyParametricEqGraphTraceFocus();
            updateEqTraceOpacity();
            updateEqFilterMarkers();
            refreshEqFilterConstraintViolationStyles();
            refreshEqFilterInactiveStateForMaxBands();
        } finally {
            eqHistoryRestoring = false;
        }
        eqHistoryRenderLog();
    };
    let eqHistoryPushSnapshot = (snap, opts) => {
        opts = opts || {};
        eqHistoryDebugLog("pushSnapshot enter", {
            extraEQEnabled,
            eqHistoryRestoring,
            chainLen: eqHistoryChain.length,
            head: eqHistoryHead,
            opts: { fromDebounced: !!opts.fromDebounced, bypassSnapEqual: !!opts.bypassSnapEqual }
        });
        if (!extraEQEnabled || eqHistoryRestoring) {
            eqHistoryDebugLog("pushSnapshot skip: !extraEQEnabled || eqHistoryRestoring");
            return;
        }
        if (eqHistoryPendingPreEditSnap) {
            eqHistoryChain.push(eqHistoryPendingPreEditSnap);
            eqHistoryHead = 0;
            eqHistoryPendingPreEditSnap = null;
            eqHistoryLastCommitAt = 0;
        }
        if (!eqHistoryChain.length) {
            if (opts.fromDebounced && eqHistoryInitBaselineSnap != null) {
                if (eqHistorySnapDataEqual(snap, eqHistoryInitBaselineSnap)) {
                    eqHistoryDebugLog("pushSnapshot skip: empty chain, snap equals init baseline");
                    return;
                }
                eqHistoryPendingPreEditSnap = eqHistoryInitBaselineSnap;
                eqHistoryPushSnapshot(snap, { fromDebounced: false });
                return;
            }
            eqHistoryChain.push(snap);
            eqHistoryHead = 0;
            eqHistoryLastCommitAt = Date.now();
            eqHistoryTrimToCap();
            eqHistoryRenderLog();
            eqHistoryDebugLog("pushSnapshot: first entry on empty chain");
            return;
        }
        if (!opts.bypassSnapEqual && eqHistorySnapDataEqual(snap, eqHistoryChain[eqHistoryHead])) {
            eqHistoryDebugLog("pushSnapshot skip: snap equals head (equality)", {
                headRowsSample: (eqHistoryChain[eqHistoryHead].rows || []).slice(0, 3),
                snapRowsSample: (snap.rows || []).slice(0, 3)
            });
            return;
        }
        eqHistoryChain.splice(eqHistoryHead + 1);
        eqHistoryChain.push(snap);
        eqHistoryHead = eqHistoryChain.length - 1;
        eqHistoryTrimToCap();
        eqHistoryLastCommitAt = Date.now();
        eqHistoryRenderLog();
        eqHistoryDebugLog("pushSnapshot: appended", { newHead: eqHistoryHead, chainLen: eqHistoryChain.length });
    };
    let eqHistoryCommitTransaction = (optBeforeSnap, meta) => {
        if (!extraEQEnabled || eqHistoryRestoring) {
            return;
        }
        eqHistoryClearTimers();
        if (optBeforeSnap && !eqHistoryChain.length) {
            eqHistoryChain.push(optBeforeSnap);
            eqHistoryHead = 0;
            eqHistoryLastCommitAt = 0;
        }
        eqHistoryPushSnapshot(eqHistoryTakeSnapshot(meta));
        /* Must match post-commit DOM so the next applyEQExec (e.g. graph context-menu type cycle) can
           detect PK→LSQ; null here made lastSig null and skipped the type/enable history path. */
        eqHistoryLastApplyTypeEnableSig = eqHistoryCaptureTypeEnableSigFromDom();
    };
    let eqHistoryDebouncedFlush = () => {
        eqHistoryDebounceTimer = null;
        if (!extraEQEnabled || eqHistoryRestoring) {
            return;
        }
        let now = Date.now();
        let since = now - eqHistoryLastCommitAt;
        if (eqHistoryLastCommitAt > 0 && since < EQ_HISTORY_MIN_GAP_MS) {
            if (eqHistoryGapWaitTimer !== null) {
                clearTimeout(eqHistoryGapWaitTimer);
                eqHistoryGapWaitTimer = null;
            }
            eqHistoryGapWaitTimer = setTimeout(() => {
                eqHistoryGapWaitTimer = null;
                eqHistoryDebouncedFlush();
            }, EQ_HISTORY_MIN_GAP_MS - since);
            return;
        }
        let snap = eqHistoryTakeSnapshot();
        eqHistoryPushSnapshot(snap, { fromDebounced: true });
    };
    function eqHistoryNotifyChange() {
        if (!extraEQEnabled || eqHistoryRestoring || !filtersContainer) {
            return;
        }
        if (eqHistoryGapWaitTimer !== null) {
            clearTimeout(eqHistoryGapWaitTimer);
            eqHistoryGapWaitTimer = null;
        }
        if (eqHistoryDebounceTimer !== null) {
            clearTimeout(eqHistoryDebounceTimer);
        }
        eqHistoryDebounceTimer = setTimeout(eqHistoryDebouncedFlush, EQ_HISTORY_DEBOUNCE_MS);
    }
    let eqHistoryUndo = () => {
        if (eqHistoryHead <= 0) {
            return;
        }
        eqHistoryClearTimers();
        eqHistoryHead--;
        eqHistoryRestore(eqHistoryChain[eqHistoryHead]);
    };
    let eqHistoryRedo = () => {
        if (eqHistoryHead < 0 || eqHistoryHead >= eqHistoryChain.length - 1) {
            return;
        }
        eqHistoryClearTimers();
        eqHistoryHead++;
        eqHistoryRestore(eqHistoryChain[eqHistoryHead]);
    };
    let eqHistoryShortcutTargetOk = (t) => {
        if (!t || t.nodeType !== 1) {
            return true;
        }
        if (t.isContentEditable || (t.closest && t.closest("[contenteditable=\"true\"]"))) {
            return false;
        }
        let tag = t.tagName;
        if (tag === "TEXTAREA" || tag === "SELECT") {
            return false;
        }
        if (tag === "INPUT") {
            let typ = (t.getAttribute("type") || "").toLowerCase();
            if (typ === "text" || typ === "search" || typ === "email" || typ === "url"
                    || typ === "password" || typ === "") {
                return false;
            }
        }
        if (t.matches && t.matches("input[name='eq-constraint-freq-min'], input[name='eq-constraint-freq-max'], input[name='eq-constraint-freq-graphic-list']")) {
            return false;
        }
        return true;
    };
    document.addEventListener("keydown", (e) => {
        if (!(e.metaKey || e.ctrlKey)) {
            return;
        }
        if (e.code !== "KeyZ" && e.code !== "KeyY") {
            return;
        }
        let tab = document.querySelector("div.select");
        if (!extraEnabled || !extraEQEnabled || !tab
                || tab.getAttribute("data-selected") !== "extra") {
            return;
        }
        if (!eqHistoryShortcutTargetOk(e.target)) {
            return;
        }
        if (e.code === "KeyY") {
            e.preventDefault();
            e.stopPropagation();
            eqHistoryRedo();
            return;
        }
        if (e.code === "KeyZ" && e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            eqHistoryRedo();
            return;
        }
        if (e.code === "KeyZ" && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            eqHistoryUndo();
        }
    }, true);
    let eq2chRowsToApplySpecs = (rows) => {
        let clamped = elemToFiltersClampedRowsForEqualizerApply(eq2chPadBankToEqBands(rows), true);
        return clamped.filter((f) => !f.disabled && f.type && f.freq && f.q && f.gain)
            .map((f) => ({ type: f.type, freq: f.freq, q: f.q, gain: f.gain }));
    };
    let eq2chMergedSpecsForChannelIndex = (chIdx) => {
        let bothS = eq2chRowsToApplySpecs(eq2chBankData.both);
        if (!LR || !LR.length) {
            return bothS;
        }
        let lab = LR[Math.min(chIdx, LR.length - 1)];
        let out = bothS.slice();
        if (lab === "L") {
            out.push(...eq2chRowsToApplySpecs(eq2chBankData.L));
        } else if (lab === "R") {
            out.push(...eq2chRowsToApplySpecs(eq2chBankData.R));
        }
        return out;
    };
    /** One FR curve shared for 2ch EQ preview/apply: average across LR sides, each side optionally
        averaged across multiple samples (raw layout [L1…Lk, R1…Rk, …] from loadFiles merge order). */
    let eq2chSharedMeasurementBaseRaw = (phoneObj) => {
        if (!phoneObj || !phoneObj.rawChannels || !LR || LR.length < 2) {
            return null;
        }
        let raws = phoneObj.rawChannels;
        if (!raws.length || raws.length % LR.length !== 0) {
            return null;
        }
        let nPerSide = raws.length / LR.length;
        let sideCurves = [];
        for (let li = 0; li < LR.length; li++) {
            let bucket = [];
            for (let s = 0; s < nPerSide; s++) {
                let c = raws[li * nPerSide + s];
                if (c) {
                    bucket.push(c);
                }
            }
            if (!bucket.length) {
                sideCurves.push(null);
            } else if (bucket.length === 1) {
                sideCurves.push(bucket[0]);
            } else {
                sideCurves.push(avgCurves(bucket));
            }
        }
        let present = sideCurves.filter(Boolean);
        if (!present.length) {
            return null;
        }
        return present.length === 1 ? present[0] : avgCurves(present);
    };
    let eq2chGraphPreviewChannelIndex = () => {
        if (!isEqTwoChannelSupportEnabled()) {
            return 0;
        }
        if (eq2chActiveBank === "R") {
            let ix = LR.indexOf("R");
            return ix >= 0 ? ix : 1;
        }
        if (eq2chActiveBank === "L") {
            let ixL = LR.indexOf("L");
            return ixL >= 0 ? ixL : 0;
        }
        return 0;
    };
    let eq2chSyncBankTabStyles = () => {
        if (!eq2chBankTabsEl) {
            return;
        }
        let pos = eq2chActiveBank === "L" ? "0" : eq2chActiveBank === "R" ? "2" : "1";
        let track = eq2chBankTabsEl.querySelector(".eq-2ch-bank-seg-track");
        if (track) {
            track.setAttribute("data-eq-2ch-pos", pos);
        }
        eq2chBankTabsEl.querySelectorAll(".eq-2ch-bank-seg-btn").forEach((btn) => {
            let b = btn.getAttribute("data-eq-2ch-bank");
            let on = b === eq2chActiveBank;
            btn.setAttribute("aria-selected", on ? "true" : "false");
            btn.tabIndex = on ? 0 : -1;
        });
    };
    let eq2chSwitchBank = (next) => {
        if (!isEqTwoChannelSupportEnabled() || (next !== "both" && next !== "L" && next !== "R")) {
            return;
        }
        if (next === eq2chActiveBank) {
            return;
        }
        let finishBankSwitch = () => {
            eq2chFlushDomToActiveBank();
            eq2chActiveBank = next;
            filtersToElem(eq2chPadBankToEqBands(eq2chBankData[eq2chActiveBank]));
            eq2chSyncBankTabStyles();
            cancelDeferredApplyEQ();
            applyEQExec();
            scheduleLiveEqSync();
        };
        let prefersReducedMotion = typeof window.matchMedia === "function"
            && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!filtersContainer || prefersReducedMotion) {
            finishBankSwitch();
            return;
        }
        clearEq2chBankSwapAnimation();
        let mySeq = ++eq2chBankSwapSeq;
        let animClass = "eq-2ch-bank-filters-swap-anim";
        void filtersContainer.offsetWidth;
        filtersContainer.classList.add(animClass);
        eq2chBankSwapAnimEndFn = (e) => {
            if (e.target !== filtersContainer || e.animationName !== "eq2chBankFiltersSwap") {
                return;
            }
            if (mySeq !== eq2chBankSwapSeq) {
                return;
            }
            filtersContainer.removeEventListener("animationend", eq2chBankSwapAnimEndFn);
            eq2chBankSwapAnimEndFn = null;
            filtersContainer.classList.remove(animClass);
        };
        filtersContainer.addEventListener("animationend", eq2chBankSwapAnimEndFn);
        eq2chBankSwapApplyTimer = setTimeout(() => {
            eq2chBankSwapApplyTimer = null;
            if (mySeq !== eq2chBankSwapSeq) {
                return;
            }
            finishBankSwitch();
        }, EQ_2CH_BANK_SWAP_APPLY_AT_MS);
        eq2chBankSwapCleanupTimer = setTimeout(() => {
            eq2chBankSwapCleanupTimer = null;
            if (mySeq !== eq2chBankSwapSeq) {
                return;
            }
            if (filtersContainer && eq2chBankSwapAnimEndFn) {
                filtersContainer.removeEventListener("animationend", eq2chBankSwapAnimEndFn);
                eq2chBankSwapAnimEndFn = null;
            }
            if (filtersContainer) {
                filtersContainer.classList.remove(animClass);
            }
        }, EQ_2CH_BANK_SWAP_ANIM_MS + 80);
    };
    let eq2chInitBanksFromCurrentDom = () => {
        let base = elemToFilters(true).map((f) => ({
            disabled: !!f.disabled,
            type: f.type,
            freq: f.freq,
            q: f.q,
            gain: f.gain
        }));
        if (!base.length) {
            base.push(eq2chDefaultEmptyRow());
        }
        eq2chBankData.both = base.slice();
        eq2chBankData.L = eq2chPadBankToEqBands([eq2chDefaultEmptyRow()]);
        eq2chBankData.R = eq2chPadBankToEqBands([eq2chDefaultEmptyRow()]);
        eq2chActiveBank = "both";
    };
    let eq2chSetTabsVisibility = (show) => {
        if (eq2chBankTabsEl) {
            eq2chBankTabsEl.hidden = !show;
        }
        if (show) {
            eq2chSyncBankTabStyles();
        }
    };
    let eq2chOnConstraintToggleChange = () => {
        if (isEqTwoChannelSupportEnabled()) {
            eq2chInitBanksFromCurrentDom();
            eq2chSetTabsVisibility(true);
            filtersToElem(eq2chPadBankToEqBands(eq2chBankData.both));
        } else {
            eq2chFlushDomToActiveBank();
            if (eq2chActiveBank !== "both") {
                eq2chActiveBank = "both";
            }
            eq2chBankData.L = [];
            eq2chBankData.R = [];
            filtersToElem(eq2chPadBankToEqBands(eq2chBankData.both));
            eq2chSetTabsVisibility(false);
        }
        eq2chSyncBankTabStyles();
        cancelDeferredApplyEQ();
        applyEQExec();
        scheduleLiveEqSync();
        eqHistoryCommitTransaction();
    };
    let eq2chResetAllBanksToDefaultRow = () => {
        eq2chBankData.both = [eq2chDefaultEmptyRow()];
        eq2chBankData.L = [eq2chDefaultEmptyRow()];
        eq2chBankData.R = [eq2chDefaultEmptyRow()];
        eq2chActiveBank = "both";
        eq2chSetTabsVisibility(isEqTwoChannelSupportEnabled());
        eq2chSyncBankTabStyles();
    };
    if (eq2chBankTabsEl) {
        eq2chBankTabsEl.addEventListener("click", (e) => {
            let btn = e.target && e.target.closest && e.target.closest("button.eq-2ch-bank-seg-btn");
            if (!btn || !eq2chBankTabsEl.contains(btn)) {
                return;
            }
            let bank = btn.getAttribute("data-eq-2ch-bank");
            eq2chSwitchBank(bank);
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }
        if (!extraEnabled || !extraEQEnabled) {
            return;
        }
        let tab = document.querySelector("div.select");
        if (!tab || tab.getAttribute("data-selected") !== "extra") {
            return;
        }
        if (!isEqTwoChannelSupportEnabled() || !eq2chBankTabsEl || eq2chBankTabsEl.hidden) {
            return;
        }
        let code = e.code;
        if (code !== "KeyL" && code !== "KeyR" && code !== "KeyA") {
            return;
        }
        let t = e.target;
        if (t && t.nodeType === 1) {
            if (t.isContentEditable || (t.closest && t.closest("[contenteditable=\"true\"]"))) {
                return;
            }
            let tag = t.tagName;
            if (tag === "TEXTAREA" || tag === "SELECT") {
                return;
            }
            if (tag === "INPUT") {
                let typ = (t.getAttribute("type") || "").toLowerCase();
                if (typ === "text" || typ === "search" || typ === "email" || typ === "url"
                        || typ === "password" || typ === "") {
                    return;
                }
            }
        }
        if (code === "KeyL") {
            if (eq2chActiveBank === "L") {
                return;
            }
            e.preventDefault();
            eq2chSwitchBank("L");
        } else if (code === "KeyR") {
            if (eq2chActiveBank === "R") {
                return;
            }
            e.preventDefault();
            eq2chSwitchBank("R");
        } else if (code === "KeyA") {
            if (eq2chActiveBank === "both") {
                return;
            }
            e.preventDefault();
            eq2chSwitchBank("both");
        }
    });
    if (eq2chConstraintToggle) {
        eq2chConstraintToggle.addEventListener("change", eq2chOnConstraintToggleChange);
    }
    /* Graphic auto-rows: Q max "0"/blank = unlimited (config hi 10); use nominal Q 1 unless min Q forces higher. */
    let eqGraphicModeTemplateQHz = () => {
        let qMaxEl = document.querySelector("div.extra-eq input[name='eq-constraint-q-max']");
        let maxRaw = qMaxEl ? String(qMaxEl.value || "").trim() : "";
        let [qLo, qHi] = getEqConstraintQLoHi();
        if (maxRaw === "" || maxRaw === "0") {
            return Math.min(qHi, Math.max(qLo, 1));
        }
        return qHi;
    };
    let eqGraphicModeApplyAutoTemplateFromBands = (bands) => {
        if (!bands || bands.length < 2 || !filterFreqInput || !filterFreqInput.length) {
            return;
        }
        if (eqFiltersUserHasEdited) {
            return;
        }
        let cap = Math.min(bands.length, extraEQBandsMax);
        let qUse = eqGraphicModeTemplateQHz();
        let qStr = qUse <= 0.3 + 1e-9
            ? String(Math.round(qUse * 100) / 100)
            : String(Math.round(qUse * 10) / 10);
        let typ = firstAllowedEqFilterType();
        if (eqBands < cap) {
            eqBands = cap;
            updateFilterElements();
        }
        for (let i = 0; i < cap; i++) {
            filterEnabledInput[i].checked = true;
            filterTypeSelect[i].value = typ;
            filterFreqInput[i].value = String(bands[i]);
            filterQInput[i].value = qStr;
            filterGainInput[i].value = "0";
        }
        for (let i = cap; i < eqBands; i++) {
            filterEnabledInput[i].checked = true;
            filterTypeSelect[i].value = typ;
            filterFreqInput[i].value = "0";
            filterQInput[i].value = "0";
            filterGainInput[i].value = "0";
        }
    };
    let applyEqGraphicModeAuxUiAndBands = (opts) => {
        opts = opts || {};
        let skipApply = !!opts.skipApply;
        let bands = Equalizer.config.EqGraphicBandFreqHz;
        let graphic = Array.isArray(bands) && bands.length >= 2;
        let maxBandsEl = document.querySelector("div.extra-eq input[name='eq-constraint-max-bands']");
        let qMinEl = document.querySelector("div.extra-eq input[name='eq-constraint-q-min']");
        if (!maxBandsEl || !qMinEl) {
            return;
        }
        if (graphic) {
            let cap = Math.min(bands.length, extraEQBandsMax);
            Equalizer.config.EqMaxBands = cap;
            maxBandsEl.value = String(cap);
            maxBandsEl.setAttribute("data-eq-graphic-max-lock", "1");
            maxBandsEl.disabled = true;
            qMinEl.disabled = true;
            eqGraphicModeApplyAutoTemplateFromBands(bands);
            refreshEqFilterInactiveStateForMaxBands();
            applyEqConstraintAttributesToFilterInputs();
            if (!skipApply) {
                cancelDeferredApplyEQ();
                applyEQExec();
                scheduleLiveEqSync();
            }
        } else {
            maxBandsEl.disabled = false;
            qMinEl.disabled = false;
            let hadGraphicMaxLock = maxBandsEl.hasAttribute("data-eq-graphic-max-lock");
            if (hadGraphicMaxLock) {
                maxBandsEl.removeAttribute("data-eq-graphic-max-lock");
                Equalizer.config.EqMaxBands = 0;
                syncEqMaxBandsFieldFromConfig();
            }
            refreshEqFilterInactiveStateForMaxBands();
            if (hadGraphicMaxLock && !skipApply) {
                cancelDeferredApplyEQ();
                applyEQExec();
                scheduleLiveEqSync();
            }
        }
    };
    let refreshEqConstraintDomValidityClasses = () => {
        let vClass = "eq-constraint-input-violation";
        let freqMinEl = document.querySelector("div.extra-eq input[name='eq-constraint-freq-min']");
        let freqMaxEl = document.querySelector("div.extra-eq input[name='eq-constraint-freq-max']");
        let freqGraphicInp = document.querySelector("div.extra-eq input[name='eq-constraint-freq-graphic-list']");
        let freqRow = document.querySelector("div.extra-eq .eq-constraint-freq-row");
        let qMinEl = document.querySelector("div.extra-eq input[name='eq-constraint-q-min']");
        let qMaxEl = document.querySelector("div.extra-eq input[name='eq-constraint-q-max']");
        let gainMinEl = document.querySelector("div.extra-eq input[name='eq-constraint-gain-min']");
        let gainMaxEl = document.querySelector("div.extra-eq input[name='eq-constraint-gain-max']");
        [freqMinEl, freqMaxEl, freqGraphicInp, qMinEl, qMaxEl, gainMinEl, gainMaxEl].forEach((el) => {
            if (el) {
                el.classList.remove(vClass);
            }
        });
        if (!freqMinEl || !freqMaxEl || !qMinEl || !qMaxEl || !gainMinEl || !gainMaxEl) {
            return;
        }
        let markPair = (minEl, maxEl, loAbs, hiAbs, intMode) => {
            let minRaw = (minEl.value || "").trim();
            let maxRaw = (maxEl.value || "").trim();
            let minInc = eqConstraintNumericInputIncomplete(minEl.value);
            let maxInc = eqConstraintNumericInputIncomplete(maxEl.value);
            let minUnl = minRaw === "" || minRaw === "0";
            let maxUnl = maxRaw === "" || maxRaw === "0";
            let parseLim = (raw, asInt) => {
                if (raw === "" || raw === "0") {
                    return null;
                }
                let v = asInt ? parseInt(raw, 10) : parseFloat(raw);
                return Number.isFinite(v) ? v : null;
            };
            let nMin = minInc ? null : parseLim(minRaw, intMode);
            let nMax = maxInc ? null : parseLim(maxRaw, intMode);
            if (!minInc && !minUnl && nMin !== null && (nMin < loAbs || nMin > hiAbs)) {
                minEl.classList.add(vClass);
            }
            if (!maxInc && !maxUnl && nMax !== null && (nMax < loAbs || nMax > hiAbs)) {
                maxEl.classList.add(vClass);
            }
            if (!minInc && !maxInc && !minUnl && !maxUnl && nMin !== null && nMax !== null
                    && nMin > nMax) {
                minEl.classList.add(vClass);
                maxEl.classList.add(vClass);
            }
        };
        if (freqRow && freqRow.classList.contains("eq-constraint-freq-row-graphic") && freqGraphicInp) {
            let rawG = (freqGraphicInp.value || "").trim();
            if (rawG !== "") {
                let listG = parseEqConstraintGraphicFreqList(rawG);
                if (listG.length < 2) {
                    freqGraphicInp.classList.add(vClass);
                }
            }
        } else {
            markPair(freqMinEl, freqMaxEl, 20, 20000, true);
        }
        markPair(qMinEl, qMaxEl, 0.1, 10, false);
        markPair(gainMinEl, gainMaxEl, -40, 40, false);
    };
    let syncEqConstraintDomToEqualizerConfig = () => {
        let freqMinEl = document.querySelector("div.extra-eq input[name='eq-constraint-freq-min']");
        let freqMaxEl = document.querySelector("div.extra-eq input[name='eq-constraint-freq-max']");
        let qMinEl = document.querySelector("div.extra-eq input[name='eq-constraint-q-min']");
        let qMaxEl = document.querySelector("div.extra-eq input[name='eq-constraint-q-max']");
        let gainMinEl = document.querySelector("div.extra-eq input[name='eq-constraint-gain-min']");
        let gainMaxEl = document.querySelector("div.extra-eq input[name='eq-constraint-gain-max']");
        let pkEl = document.querySelector("div.extra-eq input.eq-constraint-type-pk");
        let lsqEl = document.querySelector("div.extra-eq input.eq-constraint-type-lsq");
        let hsqEl = document.querySelector("div.extra-eq input.eq-constraint-type-hsq");
        if (!freqMinEl || !freqMaxEl || !qMinEl || !qMaxEl || !gainMinEl || !gainMaxEl
                || !pkEl || !lsqEl || !hsqEl) {
            return;
        }
        let prevA = Equalizer.config.AutoEQRange ? Equalizer.config.AutoEQRange.slice() : [20, 20000];
        let prevQ = Equalizer.config.OptimizeQRange ? Equalizer.config.OptimizeQRange.slice() : [0.1, 10];
        let prevG = Equalizer.config.OptimizeGainRange ? Equalizer.config.OptimizeGainRange.slice() : [-40, 40];
        let freqRow = document.querySelector("div.extra-eq .eq-constraint-freq-row");
        let gListInp = document.querySelector("div.extra-eq input[name='eq-constraint-freq-graphic-list']");
        if (freqRow && freqRow.classList.contains("eq-constraint-freq-row-graphic") && gListInp) {
            let rawG = (gListInp.value || "").trim();
            let listG = parseEqConstraintGraphicFreqList(rawG);
            if (rawG === "" || listG.length < 2) {
                clearEqConstraintGraphicFreqMode();
            } else {
                Equalizer.config.EqGraphicBandFreqHz = listG;
                Equalizer.config.AutoEQRange = [listG[0], listG[listG.length - 1]];
            }
        }
        if (!Equalizer.config.EqGraphicBandFreqHz || Equalizer.config.EqGraphicBandFreqHz.length < 2) {
            Equalizer.config.EqGraphicBandFreqHz = null;
            let fMinRaw = (freqMinEl.value || "").trim();
            let fMaxRaw = (freqMaxEl.value || "").trim();
            let fMinInc = eqConstraintNumericInputIncomplete(freqMinEl.value);
            let fMaxInc = eqConstraintNumericInputIncomplete(freqMaxEl.value);
            let fMin;
            let fMax;
            if (fMinInc) {
                fMin = prevA[0];
            } else if (fMinRaw === "" || fMinRaw === "0") {
                fMin = 20;
            } else {
                let p = parseInt(fMinRaw, 10);
                fMin = Number.isFinite(p) ? Math.min(20000, Math.max(20, p)) : prevA[0];
            }
            if (fMaxInc) {
                fMax = prevA[1];
            } else if (fMaxRaw === "" || fMaxRaw === "0") {
                fMax = 20000;
            } else {
                let p = parseInt(fMaxRaw, 10);
                fMax = Number.isFinite(p) ? Math.min(20000, Math.max(20, p)) : prevA[1];
            }
            if (fMin > fMax) {
                let t = fMin;
                fMin = fMax;
                fMax = t;
            }
            Equalizer.config.AutoEQRange = [fMin, fMax];
        }
        let qMinRaw = (qMinEl.value || "").trim();
        let qMaxRaw = (qMaxEl.value || "").trim();
        let qMinInc = eqConstraintNumericInputIncomplete(qMinEl.value);
        let qMaxInc = eqConstraintNumericInputIncomplete(qMaxEl.value);
        let qMin;
        let qMax;
        if (qMinInc) {
            qMin = prevQ[0];
        } else if (qMinRaw === "" || qMinRaw === "0") {
            qMin = 0.1;
        } else {
            let p = parseFloat(qMinRaw);
            qMin = Number.isFinite(p) ? Math.min(10, Math.max(0.1, p)) : prevQ[0];
        }
        if (qMaxInc) {
            qMax = prevQ[1];
        } else if (qMaxRaw === "" || qMaxRaw === "0") {
            qMax = 10;
        } else {
            let p = parseFloat(qMaxRaw);
            qMax = Number.isFinite(p) ? Math.min(10, Math.max(0.1, p)) : prevQ[1];
        }
        if (qMin > qMax) {
            let t = qMin;
            qMin = qMax;
            qMax = t;
        }
        let gMinRaw = (gainMinEl.value || "").trim();
        let gMaxRaw = (gainMaxEl.value || "").trim();
        let gMinInc = eqConstraintNumericInputIncomplete(gainMinEl.value);
        let gMaxInc = eqConstraintNumericInputIncomplete(gainMaxEl.value);
        let gMin;
        let gMax;
        if (gMinInc) {
            gMin = prevG[0];
        } else if (gMinRaw === "" || gMinRaw === "0") {
            gMin = -40;
        } else {
            let p = parseFloat(gMinRaw);
            gMin = Number.isFinite(p) ? Math.min(40, Math.max(-40, p)) : prevG[0];
        }
        if (gMaxInc) {
            gMax = prevG[1];
        } else if (gMaxRaw === "" || gMaxRaw === "0") {
            gMax = 40;
        } else {
            let p = parseFloat(gMaxRaw);
            gMax = Number.isFinite(p) ? Math.min(40, Math.max(-40, p)) : prevG[1];
        }
        if (gMin > gMax) {
            let t = gMin;
            gMin = gMax;
            gMax = t;
        }
        let allowPk = pkEl.checked;
        let allowLsq = lsqEl.checked;
        let allowHsq = hsqEl.checked;
        if (!allowPk && !allowLsq && !allowHsq) {
            allowPk = true;
            pkEl.checked = true;
        }
        Equalizer.config.OptimizeQRange = [qMin, qMax];
        Equalizer.config.OptimizeGainRange = [gMin, gMax];
        Equalizer.config.EqAllowedTypes = { PK: allowPk, LSQ: allowLsq, HSQ: allowHsq };
        applyEqGraphicModeAuxUiAndBands();
        applyEqConstraintAttributesToFilterInputs();
        refreshEqConstraintDomValidityClasses();
        refreshEqFilterConstraintViolationStyles();
        refreshEqFilterInactiveStateForMaxBands();
    };
    let commitEqMaxBandsFromInput = (opts) => {
        opts = opts || {};
        let maxBandsEl = document.querySelector("div.extra-eq input[name='eq-constraint-max-bands']");
        if (!maxBandsEl || maxBandsEl.disabled) {
            return;
        }
        let parsed = parseInt(maxBandsEl.value, 10);
        let maxB;
        if (!Number.isFinite(parsed) || parsed <= 0) {
            maxB = 0;
        } else {
            maxB = Math.min(Math.max(1, parsed), extraEQBandsMax);
        }
        Equalizer.config.EqMaxBands = maxB;
        if (opts.writeBackDom !== false) {
            maxBandsEl.value = maxB <= 0 ? "0" : String(maxB);
        }
        maxBandsEl.setAttribute("max", String(extraEQBandsMax));
        refreshEqFilterInactiveStateForMaxBands();
        cancelDeferredApplyEQ();
        applyEQExec();
        scheduleLiveEqSync();
    };
    let syncEqMaxBandsFieldFromConfig = () => {
        let maxBandsEl = document.querySelector("div.extra-eq input[name='eq-constraint-max-bands']");
        if (!maxBandsEl) {
            return;
        }
        let cfg = Math.floor(Number(Equalizer.config.EqMaxBands));
        maxBandsEl.value = (!Number.isFinite(cfg) || cfg <= 0) ? "0" : String(Math.min(cfg, extraEQBandsMax));
        maxBandsEl.setAttribute("max", String(extraEQBandsMax));
    };
    let eqInterpDbAtHz = (pts, fHz) => {
        if (!pts || pts.length < 2) {
            return null;
        }
        let f = Math.min(20000, Math.max(20, fHz));
        let i = 0;
        while (i < pts.length - 1 && pts[i + 1][0] < f) {
            i++;
        }
        if (i >= pts.length - 1) {
            return pts[pts.length - 1][1];
        }
        let f0 = pts[i][0];
        let f1 = pts[i + 1][0];
        let d0 = pts[i][1];
        let d1 = pts[i + 1][1];
        if (f <= f0) {
            return d0;
        }
        if (f1 <= f0 || f0 <= 0) {
            return d0;
        }
        let t = (Math.log(f) - Math.log(f0)) / (Math.log(f1) - Math.log(f0));
        return d0 * (1 - t) + d1 * t;
    };
    /* Same implicit FR target as applyEQExec / AutoEQ when the dropdown is still “Choose EQ model” */
    let resolveEqGraphPhoneObj = () => {
        let sel = eqPhoneSelect && eqPhoneSelect.value;
        if (sel) {
            return activePhones.filter(p => p.fullName === sel)[0] || null;
        }
        return activePhones.filter(p =>
            !p.isTarget && p.fullName && !p.fullName.match(/ EQ$/))[0] || null;
    };
    /* Prefer the EQ child channel when present; otherwise derive the EQ-shaped curve from the DOM
       filters so preview/markers never snap to the raw trace during one-frame EQ lag (notably
       Safari + overlap with the unequalized curve). */
    let eqGraphResolveEqTraceForLayout = (phoneObj) => {
        if (!phoneObj) {
            return null;
        }
        let rawCh = firstPresentChannel(phoneObj.rawChannels);
        if (!rawCh) {
            return null;
        }
        let eqPhone = phoneObj.eq;
        let chIx = eq2chGraphPreviewChannelIndex();
        let eqCh = eqPhone && eqPhone.rawChannels && eqPhone.rawChannels[chIx]
            ? eqPhone.rawChannels[chIx]
            : (eqPhone && firstPresentChannel(eqPhone.rawChannels));
        if (eqCh) {
            return { tracePhone: eqPhone, traceCh: eqCh, strokePhone: eqPhone };
        }
        let chPv = chIx;
        let base2 = isEqTwoChannelSupportEnabled() ? eq2chSharedMeasurementBaseRaw(phoneObj) : null;
        let rawChUse = base2
            ? base2
            : ((phoneObj.rawChannels && phoneObj.rawChannels[chPv])
                ? phoneObj.rawChannels[chPv]
                : rawCh);
        let filters = isEqTwoChannelSupportEnabled()
            ? eq2chMergedSpecsForChannelIndex(chPv)
            : elemToFiltersClampedForEqualizerApply(false);
        if (filters.length && typeof Equalizer !== "undefined" && Equalizer.apply) {
            try {
                let fr = Equalizer.apply(rawChUse, filters);
                if (fr) {
                    return { tracePhone: phoneObj, traceCh: fr, strokePhone: phoneObj };
                }
            } catch (err) { /* noop */ }
        }
        return { tracePhone: phoneObj, traceCh: rawChUse, strokePhone: phoneObj };
    };
    let computeEqNodePreviewAtMouse = (m) => {
        if (!m || m.length < 2) {
            return null;
        }
        let tab = document.querySelector("div.select");
        if (!extraEnabled || !extraEQEnabled || !tab
            || tab.getAttribute("data-selected") !== "extra") {
            return null;
        }
        let phoneObj = resolveEqGraphPhoneObj();
        if (!phoneObj) {
            return null;
        }
        let resolved = eqGraphResolveEqTraceForLayout(phoneObj);
        if (!resolved) {
            return null;
        }
        let { tracePhone, traceCh } = resolved;
        let fHz = Math.min(20000, Math.max(20, x.invert(m[0])));
        let pts = baseline.fn(traceCh);
        let db = eqInterpDbAtHz(pts, fHz);
        if (db === null || !Number.isFinite(db)) {
            return null;
        }
        return { fHz, phoneObj, tracePhone, db, pts };
    };
    let applyEqGraphTraceStrokeEmphasis = (tracePhone, enabled) => {
        gpath.selectAll("path").each(function (d) {
            let n = d3.select(this);
            let base = this.classList.contains("sample")
                ? EQ_GRAPH_TRACE_STROKE_SAMPLE
                : EQ_GRAPH_TRACE_STROKE_NORMAL;
            let match = Boolean(enabled && tracePhone && d && d.p
                && (d.p === tracePhone || d.p.fileName === tracePhone.fileName));
            let w;
            if (d && d.p && d.p.isTarget) {
                let tW = targetTraceStrokeWidthForPhone(d.p);
                w = match ? tW * EQ_GRAPH_TRACE_STROKE_EMPH_MULT : tW;
            } else {
                w = match ? base * EQ_GRAPH_TRACE_STROKE_EMPH_MULT : base;
            }
            /* Always set via .attr; CSS transitions stroke-width on g.curves-g path. D3 transitions
               here restarted every sync when de-emphasized and could stick thin if attr was inherited. */
            n.interrupt(EQ_GRAPH_TRACE_EM_TNAME);
            n.attr("stroke-width", w);
        });
    };
    let eqGraphPlotDistPx = (m, gx, gy) => {
        if (!m || m.length < 2) {
            return Infinity;
        }
        let plot = graphPlotHitRect && graphPlotHitRect.node();
        if (!plot) {
            return Infinity;
        }
        let svg = plot.ownerSVGElement || (plot.closest && plot.closest("svg"));
        if (!svg || !svg.viewBox || !svg.getBoundingClientRect) {
            return Infinity;
        }
        let rect = svg.getBoundingClientRect();
        let vb = svg.viewBox.baseVal;
        let pxPerSvgX = rect.width / Math.max(1e-6, vb.width);
        let pxPerSvgY = rect.height / Math.max(1e-6, vb.height);
        let dxPx = (m[0] - gx) * pxPerSvgX;
        let dyPx = (m[1] - gy) * pxPerSvgY;
        return Math.hypot(dxPx, dyPx);
    };
    /* Same enabled-band list as elemToFilters(); if shelfRowAsPk === j and row j is LSQ/HSQ, use PK
       so the summed response matches “this band as a peak” for marker anchoring. */
    let eqFiltersListForApply = (shelfRowAsPk) => {
        let out = [];
        let maxA = getEffectiveEqMaxBands();
        for (let j = 0; j < eqBands; ++j) {
            if (j >= maxA) {
                continue;
            }
            let disabled = !filterEnabledInput[j].checked;
            let t = (filterTypeSelect[j].value || "").trim();
            let f = parseInt(filterFreqInput[j].value, 10) || 0;
            let qv = parseFloat(filterQInput[j].value) || 0;
            let g = parseFloat(filterGainInput[j].value) || 0;
            if (disabled || !t || !f || !qv || !g) {
                continue;
            }
            let typ = t;
            if (shelfRowAsPk !== null && shelfRowAsPk !== undefined && j === shelfRowAsPk
                    && (t === "LSQ" || t === "HSQ")) {
                typ = "PK";
            }
            out.push({ type: typ, freq: f, q: qv, gain: g });
        }
        return out;
    };
    let buildEqGraphMarkerLayout = () => {
        let phoneObj = resolveEqGraphPhoneObj();
        if (!phoneObj) {
            return null;
        }
        let resolved = eqGraphResolveEqTraceForLayout(phoneObj);
        if (!resolved) {
            return null;
        }
        let { tracePhone, traceCh, strokePhone } = resolved;
        let pts = baseline.fn(traceCh);
        let yOff = y(getOffset(tracePhone)) - y(0);
        let strokeCol = getCurveColor(strokePhone.id, 0);
        let pvCh = eq2chGraphPreviewChannelIndex();
        let phoneRaw0 = (phoneObj.rawChannels && phoneObj.rawChannels[pvCh])
            ? phoneObj.rawChannels[pvCh]
            : firstPresentChannel(phoneObj.rawChannels);
        let rows = [];
        let maxA = getEffectiveEqMaxBands();
        for (let i = 0; i < eqBands; i++) {
            if (i >= maxA) {
                continue;
            }
            let disabled = !filterEnabledInput[i].checked;
            let type = filterTypeSelect[i].value;
            let freq = parseInt(filterFreqInput[i].value, 10) || 0;
            let q = parseFloat(filterQInput[i].value) || 0;
            let gain = parseFloat(filterGainInput[i].value) || 0;
            if (disabled || !type || !freq || !q || !gain) {
                continue;
            }
            let typeTrim = (type || "").trim();
            /* Shelves: Y = EQ trace at this freq if this band were PK (same f/q/gain), so toggling
               PK <-> shelf does not move the node; the drawn EQ curve still uses the real shelf. */
            let db;
            if ((typeTrim === "LSQ" || typeTrim === "HSQ")
                    && phoneRaw0
                    && typeof Equalizer !== "undefined" && Equalizer.apply) {
                let filtPk = eqFiltersListForApply(i);
                try {
                    let frEq = Equalizer.apply(phoneRaw0, filtPk);
                    let ptsPk = baseline.fn(frEq);
                    db = eqInterpDbAtHz(ptsPk, freq);
                } catch (err) {
                    db = null;
                }
                if (db === null || !Number.isFinite(db)) {
                    db = eqInterpDbAtHz(pts, freq);
                }
            } else {
                db = eqInterpDbAtHz(pts, freq);
            }
            if (db === null || !Number.isFinite(db)) {
                continue;
            }
            rows.push({
                rowIndex: i,
                freq,
                q,
                gain,
                type,
                cx: x(freq),
                cy: y(db) + yOff,
            });
        }
        return { tracePhone, strokeCol, rows };
    };
    let findEqGraphMarkerHit = (m) => {
        if (!m || m.length < 2) {
            return null;
        }
        let tab = document.querySelector("div.select");
        if (!extraEnabled || !extraEQEnabled || !tab
                || tab.getAttribute("data-selected") !== "extra") {
            return null;
        }
        let layout = buildEqGraphMarkerLayout();
        if (!layout || !layout.rows.length) {
            return null;
        }
        let hitR = EQ_GRAPH_MARKER_HIT_PX;
        let best = null;
        let bestD = Infinity;
        for (let j = 0; j < layout.rows.length; j++) {
            let row = layout.rows[j];
            let d = eqGraphPlotDistPx(m, row.cx, row.cy);
            if (d > hitR) {
                continue;
            }
            if (d < bestD) {
                bestD = d;
                best = row;
            }
        }
        return best;
    };
    let eq2chPadPinnedBankRowsForGhost = (arr, bandCount) => {
        let filtersCopy = (arr || []).map((f) => ({
            disabled: !!f.disabled,
            type: f.type,
            freq: f.freq,
            q: f.q,
            gain: f.gain
        }));
        let bc = Math.max(1, bandCount || 1);
        while (filtersCopy.length < bc) {
            filtersCopy.push(eq2chDefaultEmptyRow());
        }
        if (filtersCopy.length > bc) {
            filtersCopy.length = bc;
        }
        return filtersCopy;
    };
    let pinnedBankRowsToApplySpecs = (bankRows, bandCount) => {
        let padded = eq2chPadPinnedBankRowsForGhost(bankRows, bandCount);
        let clamped = elemToFiltersClampedRowsForEqualizerApply(padded, true);
        return clamped.filter((f) => !f.disabled && f.type && f.freq && f.q && f.gain)
            .map((f) => ({ type: f.type, freq: f.freq, q: f.q, gain: f.gain }));
    };
    let eq2chMergedPinnedSpecs = (banks, chIdx, bandCount) => {
        let bothS = pinnedBankRowsToApplySpecs(banks.both || [], bandCount);
        if (!LR || !LR.length) {
            return bothS;
        }
        let lab = LR[Math.min(chIdx, LR.length - 1)];
        let out = bothS.slice();
        if (lab === "L") {
            out.push(...pinnedBankRowsToApplySpecs(banks.L || [], bandCount));
        } else if (lab === "R") {
            out.push(...pinnedBankRowsToApplySpecs(banks.R || [], bandCount));
        }
        return out;
    };
    /* Biquad specs from the pinned history snapshot (for live A/B when Compare is off / A). */
    let elemToPinnedLivePlaybackSpecs = () => {
        if (!eqPinnedSnapshotBody || !extraEnabled || !extraEQEnabled) {
            return [];
        }
        if (!resolveEqGraphPhoneObj()) {
            return [];
        }
        let pin = eqPinnedSnapshotBody;
        let pinBc = pin.bandCount || 0;
        let rows;
        if (isEqTwoChannelSupportEnabled() && pin.twoCh && pin.banks) {
            rows = eq2chPadBankToEqBands(eq2chPadPinnedBankRowsForGhost(pin.banks.both || [], pinBc));
        } else {
            rows = eqHistoryPadSnapRows({ rows: pin.rows || [], bandCount: pinBc }, pinBc);
        }
        return elemToFiltersClampedRowsForEqualizerApply(rows, false)
            .filter((f) => !f.disabled && f.type && f.freq && f.q && f.gain)
            .map((f) => ({
                type: f.type,
                freq: Math.min(20000, Math.max(20, f.freq)),
                q: Math.max(1e-4, Math.min(1000, f.q)),
                gain: Math.max(-40, Math.min(40, f.gain)),
            }));
    };
    let eqGhostRawForSide = (phoneObj, sideLi) => {
        let raws = phoneObj.rawChannels;
        if (!raws || !LR || !LR.length || raws.length % LR.length !== 0) {
            return firstPresentChannel(raws);
        }
        let nPerSide = raws.length / LR.length;
        let bucket = [];
        for (let s = 0; s < nPerSide; s++) {
            let c = raws[sideLi * nPerSide + s];
            if (c) {
                bucket.push(c);
            }
        }
        if (!bucket.length) {
            return null;
        }
        return bucket.length === 1 ? bucket[0] : avgCurves(bucket);
    };
    let cloneEqFrPoints = (fr) => (fr && fr.length ? fr.map((pt) => [pt[0], pt[1]]) : null);
    let computePinnedEqFrForModel = (modelP, pin) => {
        if (!modelP || !pin || typeof Equalizer === "undefined" || !Equalizer.apply) {
            return { ok: false };
        }
        let pinBc = pin.bandCount || 0;
        let tryPinnedRowsOnRaw = (raw) => {
            if (!raw) {
                return null;
            }
            let padRows = eqHistoryPadSnapRows({ rows: pin.rows || [], bandCount: pinBc }, pinBc);
            let specs = elemToFiltersClampedRowsForEqualizerApply(padRows.map((r) => ({
                disabled: !!r.disabled,
                type: r.type,
                freq: r.freq,
                q: r.q,
                gain: r.gain
            })), true).filter((f) => !f.disabled && f.type && f.freq && f.q && f.gain)
                .map((f) => ({ type: f.type, freq: f.freq, q: f.q, gain: f.gain }));
            if (!specs.length) {
                return null;
            }
            return Equalizer.apply(raw, specs);
        };
        let frBySide = null;
        let frSingle = null;
        try {
            if (isEqTwoChannelSupportEnabled() && pin.twoCh && pin.banks && LR && LR.length >= 2
                    && modelP.rawChannels && modelP.rawChannels.length % LR.length === 0) {
                frBySide = [];
                for (let li = 0; li < LR.length; li++) {
                    let rawSide = eqGhostRawForSide(modelP, li);
                    let specs = eq2chMergedPinnedSpecs(pin.banks, li, pinBc);
                    frBySide[li] = (rawSide && specs.length) ? Equalizer.apply(rawSide, specs) : null;
                }
                let curves = frBySide.filter(Boolean);
                if (curves.length >= 2) {
                    frSingle = avgCurves(curves);
                } else if (curves.length === 1) {
                    frSingle = curves[0];
                }
            }
            if (!frSingle) {
                let raw = eq2chSharedMeasurementBaseRaw(modelP) || firstPresentChannel(modelP.rawChannels);
                frSingle = tryPinnedRowsOnRaw(raw);
            }
        } catch (err) {
            return { ok: false };
        }
        if (!frSingle) {
            return { ok: false };
        }
        let usableSides = frBySide && frBySide.some(Boolean);
        return { ok: true, frSingle, frBySide: usableSides ? frBySide : null };
    };
    let syncEqPinnedParentTrace = () => {
        let pinGloballyActive = !!(extraEnabled && extraEQEnabled && eqPinnedSnapshotBody);
        let modelP = resolveEqGraphPhoneObj();
        let didRestore = false;
        activePhones.forEach((p) => {
            if (p.isTarget || !p._eqPinParentOverride) {
                return;
            }
            let keep = pinGloballyActive && modelP && !modelP.isTarget && p === modelP;
            if (!keep) {
                p._eqPinParentOverride = false;
                setCurves(p, p.avg, undefined, p.ssamp);
                normalizePhone(p);
                didRestore = true;
            }
        });
        if (didRestore) {
            rebindGraphPathSelectionAndRedraw();
        }
        if (!pinGloballyActive || !modelP || modelP.isTarget) {
            return;
        }
        let frPack = computePinnedEqFrForModel(modelP, eqPinnedSnapshotBody);
        if (!frPack.ok) {
            return;
        }
        let ac = modelP.activeCurves;
        if (!ac || !ac.length) {
            return;
        }
        modelP._eqPinParentOverride = true;
        if (modelP.avg && ac.length === 1) {
            let c0 = cloneEqFrPoints(frPack.frSingle);
            if (c0) {
                ac[0].l = c0;
            }
        } else if (!modelP.avg && frPack.frBySide && LR && LR.length) {
            ac.forEach((curve) => {
                let sideFr = typeof curve.o === "number" ? frPack.frBySide[curve.o] : null;
                let src = sideFr || frPack.frSingle;
                let cpy = cloneEqFrPoints(src);
                if (cpy) {
                    curve.l = cpy;
                }
            });
        } else {
            ac.forEach((curve) => {
                let cpy = cloneEqFrPoints(frPack.frSingle);
                if (cpy) {
                    curve.l = cpy;
                }
            });
        }
        normalizePhone(modelP);
        if (baseline.p === modelP) {
            baseline = getBaseline(modelP);
            updateYCenter();
        }
        gpath.selectAll("path").call(redrawLine);
    };
    updateEqFilterMarkers = () => {
        syncEqPinnedParentTrace();
        let layout = buildEqGraphMarkerLayout();
        if (!layout || !layout.rows.length) {
            gEqFilterMarkers.selectAll("circle.eq-filter-marker").remove();
            gEqFilterMarkers.raise();
            gEqHoverPreview.raise();
            if (!eqGraphPointerState && lastGraphPlotPointerClient) {
                let lp = lastGraphPlotPointerClient;
                let mResync = clientToGraphPlotXY(lp.x, lp.y);
                if (mResync) {
                    syncEqHoverPreview(mResync);
                }
            }
            return;
        }
        let mk = gEqFilterMarkers.selectAll("circle.eq-filter-marker")
            .data(layout.rows, d => d.rowIndex);
        mk.exit().remove();
        mk = mk.enter().append("circle")
            .attr("class", "eq-filter-marker")
            .attr("r", EQ_GRAPH_MARKER_R_BASE)
            .merge(mk)
            .attr("cx", d => d.cx)
            .attr("cy", d => d.cy)
            .attr("stroke", layout.strokeCol)
            .attr("stroke-width", EQ_GRAPH_MARKER_STROKE_W);
        let dragIx = eqGraphPointerState != null && eqGraphPointerState.filterIndex !== null
            ? eqGraphPointerState.filterIndex
            : null;
        applyEqFilterMarkerFillAndSize(dragIx);
        gEqSoundRangeBrush.raise();
        gEqFilterMarkers.raise();
        gEqHoverPreview.raise();
        if (!eqGraphPointerState && lastGraphPlotPointerClient) {
            let lp = lastGraphPlotPointerClient;
            let mResync = clientToGraphPlotXY(lp.x, lp.y);
            if (mResync) {
                syncEqHoverPreview(mResync);
            }
        }
    };
    syncEqHoverPreview = (m) => {
        if (!m) {
            lastGraphPlotPointerClient = null;
            gEqHoverPreview.selectAll("*").remove();
            if (graphPlotHitRect && graphPlotHitRect.node()) {
                graphPlotHitRect.node().style.cursor = "";
            }
            applyEqFilterMarkerFillAndSize(null);
            applyEqGraphTraceStrokeEmphasis(null, false);
            return;
        }
        let mUse = m;
        let draggingGraph = !!eqGraphPointerState;
        if (draggingGraph && eqGraphPointerState.mode !== "soundRange") {
            let hz = typeof eqGraphPointerState.liveFHz === "number"
                ? eqGraphPointerState.liveFHz
                : eqGraphPointerState.fHz;
            if (typeof hz === "number") {
                mUse = [x(hz), m[1]];
            }
        }
        let stCurve = computeEqNodePreviewAtMouse(mUse);
        let near = findEqGraphMarkerHit(mUse);
        let nearRow = near ? near.rowIndex : null;
        let dragBandIx = draggingGraph && eqGraphPointerState.filterIndex !== null
            ? eqGraphPointerState.filterIndex
            : null;
        let markerHighlightRow = dragBandIx !== null ? dragBandIx : nearRow;
        if (markerHighlightRow !== null) {
            gEqHoverPreview.selectAll("*").remove();
        }
        applyEqFilterMarkerFillAndSize(markerHighlightRow);
        let emphasizeTrace = false;
        let tracePhoneEm = null;
        if (!draggingGraph && !near && stCurve) {
            let yOffT = y(getOffset(stCurve.tracePhone)) - y(0);
            let tcx = x(stCurve.fHz);
            let tcy = y(stCurve.db) + yOffT;
            emphasizeTrace = eqGraphPlotDistPx(mUse, tcx, tcy) <= EQ_GRAPH_MARKER_HIT_PX;
            if (emphasizeTrace) {
                tracePhoneEm = stCurve.tracePhone;
            }
        }
        applyEqGraphTraceStrokeEmphasis(tracePhoneEm, emphasizeTrace);
        let tabEq = document.querySelector("div.select");
        let onExtraEqTab = extraEnabled && extraEQEnabled && tabEq
                && tabEq.getAttribute("data-selected") === "extra";
        let soundRangeAffordance = onExtraEqTab && !draggingGraph && !near && !emphasizeTrace;
        if (graphPlotHitRect && graphPlotHitRect.node()) {
            graphPlotHitRect.node().style.cursor =
                draggingGraph && eqGraphPointerState.mode === "soundRange"
                    ? (eqGraphPointerState.soundRangeActive ? "ew-resize" : "pointer")
                : draggingGraph ? "grabbing"
                : near ? "grab"
                : emphasizeTrace ? "cell"
                : soundRangeAffordance ? "pointer" : "";
        }
        if (near) {
            return;
        }
        if (!stCurve) {
            gEqHoverPreview.selectAll("*").remove();
            return;
        }
        gEqHoverPreview.selectAll("*").remove();
    };
    let applyEQRafId = null;
    let cancelDeferredApplyEQ = () => {
        if (applyEQRafId !== null) {
            cancelAnimationFrame(applyEQRafId);
            applyEQRafId = null;
        }
    };
    let filterRowIsAllZeros = (i) => {
        let f = parseInt(filterFreqInput[i].value, 10) || 0;
        let q = parseFloat(filterQInput[i].value) || 0;
        let g = parseFloat(filterGainInput[i].value) || 0;
        return f === 0 && q === 0 && g === 0;
    };
    /** When every visible row has freq/q/gain set, append one blank row (capped like graph add-filter). */
    let maybeAutoGrowEqBandsForTrailingBlank = (execOpt) => {
        if (!filtersContainer || !filterFreqInput || !filterFreqInput.length
                || !extraEQEnabled || eqHistoryRestoring) {
            return;
        }
        if (execOpt && execOpt.liveGraphEqDrag) {
            return;
        }
        let maxCap = getEffectiveEqMaxBands();
        if (eqBands >= maxCap) {
            return;
        }
        for (let i = 0; i < eqBands; i++) {
            if (filterRowIsAllZeros(i)) {
                return;
            }
        }
        eqFiltersUserHasEdited = true;
        eqBands = Math.min(eqBands + 1, maxCap);
        updateFilterElements();
        if (isEqTwoChannelSupportEnabled()) {
            eq2chFlushDomToActiveBank();
        }
        scheduleLiveEqSync();
        eqHistoryNotifyChange();
    };
    let applyEQExec = (execOpt) => {
        execOpt = execOpt || {};
        eq2chFlushDomToActiveBank();
        maybeAutoGrowEqBandsForTrailingBlank(execOpt);
        refreshEqFilterConstraintViolationStyles();
        let typeEnableSigNow = eqHistoryCaptureTypeEnableSigFromDom();
        if (typeEnableSigNow != null && eqHistoryLastApplyTypeEnableSig !== null
                && typeEnableSigNow !== eqHistoryLastApplyTypeEnableSig) {
            eqHistoryDebugLog("applyEQExec type/enable sig changed", {
                prev: eqHistoryLastApplyTypeEnableSig,
                now: typeEnableSigNow,
                eqHistoryRestoring,
                extraEQEnabled,
                hasFiltersContainer: !!filtersContainer
            });
        }
        /* Do not log type/enable-only here when band count changed vs head — e.g. delete band shifts
           rows and changes the sig, but the real step is eqHistoryCommitTransaction(removeBand). */
        let headSnapForBandCount = (eqHistoryChain.length > 0 && eqHistoryHead >= 0
                && eqHistoryHead < eqHistoryChain.length)
            ? eqHistoryChain[eqHistoryHead]
            : null;
        let bandCountMatchesHead = !headSnapForBandCount
            || (headSnapForBandCount.bandCount === eqBands);
        if (typeEnableSigNow != null && eqHistoryLastApplyTypeEnableSig !== null
                && typeEnableSigNow !== eqHistoryLastApplyTypeEnableSig
                && !eqHistoryRestoring && extraEQEnabled && filtersContainer
                && bandCountMatchesHead) {
            eqHistoryClearTimers();
            eqHistoryPushSnapshot(eqHistoryTakeSnapshot(), { fromDebounced: true, bypassSnapEqual: true });
        } else if (typeEnableSigNow != null && eqHistoryLastApplyTypeEnableSig !== null
                && typeEnableSigNow !== eqHistoryLastApplyTypeEnableSig) {
            eqHistoryDebugLog("applyEQExec type/enable changed but NOT pushing (gates)", {
                eqHistoryRestoring,
                extraEQEnabled,
                hasFiltersContainer: !!filtersContainer
            });
        }
        try {
        // Create and show phone with eq applied
        let activeElem = document.activeElement;
        let phoneSelected = eqPhoneSelect.value;
        let filters = elemToFiltersClampedForEqualizerApply();
        let hasEqSpecs = filters.length > 0;
        if (isEqTwoChannelSupportEnabled()) {
            hasEqSpecs = eq2chRowsToApplySpecs(eq2chBankData.both).length > 0
                || eq2chRowsToApplySpecs(eq2chBankData.L).length > 0
                || eq2chRowsToApplySpecs(eq2chBankData.R).length > 0;
        }
        if (hasEqSpecs && !phoneSelected) {
            let firstPhone = eqPhoneSelect.querySelectorAll("option")[1];
            if (firstPhone) {
                phoneSelected = eqPhoneSelect.value = firstPhone.value;
                eqPhoneSelect.dataset.eqLastModel = phoneSelected || "";
            }
        }
        let phoneObj = phoneSelected && activePhones.filter(
            p => p.fullName == phoneSelected)[0];
        if (!phoneObj || (!hasEqSpecs && !phoneObj.eq)) {
            updateEqFilterMarkers();
            return;
        }
        let nextEqChannels;
        if (isEqTwoChannelSupportEnabled()) {
            let raws = phoneObj.rawChannels || [];
            let base2 = eq2chSharedMeasurementBaseRaw(phoneObj);
            if (base2) {
                nextEqChannels = LR.map((_, chIdx) =>
                    Equalizer.apply(base2, eq2chMergedSpecsForChannelIndex(chIdx)));
            } else {
                let nPerSide = LR.length && raws.length % LR.length === 0
                    ? raws.length / LR.length
                    : 0;
                nextEqChannels = raws.map((c, chIdx) => {
                    if (!c) {
                        return null;
                    }
                    let lrIdx = nPerSide >= 1
                        ? Math.min(LR.length - 1, Math.floor(chIdx / nPerSide))
                        : Math.min(LR.length - 1, chIdx);
                    let merged = eq2chMergedSpecsForChannelIndex(lrIdx);
                    return Equalizer.apply(c, merged);
                });
            }
        } else {
            nextEqChannels = phoneObj.rawChannels.map(
                (c) => (c ? Equalizer.apply(c, filters) : null));
        }
        let liveGraphEqDrag = Boolean(execOpt.liveGraphEqDrag && eqGraphPointerState
            && eqGraphPointerState.mode === "eq");
        if (liveGraphEqDrag && phoneObj.eq && activePhones.indexOf(phoneObj.eq) !== -1) {
            let eqP = phoneObj.eq;
            eqP.rawChannels = nextEqChannels;
            eqP.smooth = undefined;
            smoothPhone(eqP);
            normalizePhone(phoneObj);
            setCurves(eqP);
            if (isEqTwoChannelSupportEnabled() && eqP.rawChannels
                    && LR && LR.length > 1
                    && eqP.rawChannels.length === LR.length
                    && eqP.rawChannels.some(Boolean)) {
                eqP.avg = false;
                eqP.smooth = undefined;
                smoothPhone(eqP);
                setCurves(eqP, false);
                normalizePhone(eqP);
            }
            reorderActivePhonesByInitOrder();
            clusterTargetsFirstInActivePhones();
            refreshTargetStyleSlots();
            rebindGraphPathSelectionAndRedraw();
            applyParametricEqGraphTraceFocus();
            updateEqTraceOpacity();
            updateEqFilterMarkers();
            if (!execOpt.skipRestoreFocus) {
                activeElem.focus();
            }
            return;
        }
        let phoneEQ = { name: phoneObj.phone + " EQ" };
        let phoneObjEQ = addOrUpdatePhone(phoneObj.brand, phoneEQ, nextEqChannels);
        phoneObj.eq = phoneObjEQ;
        phoneObjEQ.eqParent = phoneObj;
        showPhone(phoneObjEQ, false, !!execOpt.skipRestoreFocus);
        if (isEqTwoChannelSupportEnabled() && phoneObjEQ.rawChannels
                && LR && LR.length > 1
                && phoneObjEQ.rawChannels.length === LR.length
                && phoneObjEQ.rawChannels.some(Boolean)) {
            phoneObjEQ.avg = false;
            phoneObjEQ.smooth = undefined;
            smoothPhone(phoneObjEQ);
            setCurves(phoneObjEQ, false);
            normalizePhone(phoneObjEQ);
            updatePaths(false);
        }
        if (!execOpt.skipRestoreFocus) {
            activeElem.focus();
        }
        updateEqFilterMarkers();
        } finally {
            if (typeEnableSigNow != null) {
                eqHistoryLastApplyTypeEnableSig = typeEnableSigNow;
            }
        }
    };
    /* Coalesce to one apply per animation frame so the trace follows typing without
       the old 100ms debounce pause, while bounding work during rapid input. */
    let applyEQ = () => {
        if (applyEQRafId !== null) {
            return;
        }
        applyEQRafId = requestAnimationFrame(() => {
            applyEQRafId = null;
            applyEQExec();
        });
    };
    /* Match EQ_GRAPH_WHEEL_Q_* (wheel on graph); duplicated here so filter keydown runs before
       those consts are initialized in this function. */
    const EQ_FILTER_KEYBOARD_Q_STEP = 0.1;
    const EQ_FILTER_KEYBOARD_Q_STEP_FINE = 0.01;
    const EQ_FILTER_KEYBOARD_Q_FINE_MAX = 0.3;
    let eqFreqKeyboardGridStep = (hz) => {
        let [fLo, fHi] = getEqConstraintFreqLoHi();
        let f = Math.round(Math.min(fHi, Math.max(fLo, hz)));
        if (f < 100) {
            return 1;
        }
        if (f < 1000) {
            return 10;
        }
        if (f < 10000) {
            return 100;
        }
        return 100;
    };
    let eqFreqKeyboardArrowDelta = (hz, shift) => {
        let base = eqFreqKeyboardGridStep(hz);
        return shift ? base * 10 : base;
    };
    if (filtersContainer) {
        filtersContainer.addEventListener("keydown", (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey) {
                return;
            }
            let t = e.target;
            if (!t || t.tagName !== "INPUT" || !filtersContainer.contains(t)) {
                return;
            }
            let nm = t.getAttribute("name");
            if (nm !== "freq" && nm !== "q" && nm !== "gain") {
                return;
            }
            let rowIx = -1;
            let rowEl = t.closest && t.closest("div.filter");
            if (rowEl && filtersContainer.contains(rowEl)) {
                let rows = filtersContainer.querySelectorAll("div.filter");
                rowIx = Array.prototype.indexOf.call(rows, rowEl);
            }
            if (e.code !== "ArrowUp" && e.code !== "ArrowDown") {
                return;
            }
            if (nm === "freq") {
                e.preventDefault();
                let [fLo, fHi] = getEqConstraintFreqLoHi();
                let v = parseFloat(t.value);
                if (!Number.isFinite(v)) {
                    v = fLo;
                }
                v = Math.min(fHi, Math.max(fLo, v));
                let dir = e.code === "ArrowUp" ? 1 : -1;
                let delta = eqFreqKeyboardArrowDelta(v, e.shiftKey);
                t.value = String(Math.round(Math.min(fHi, Math.max(fLo, v + dir * delta))));
                applyEQ();
                scheduleLiveEqSync();
                eqHistoryNotifyChange();
                return;
            }
            if (nm === "q") {
                e.preventDefault();
                let [qLo, qHi] = getEqConstraintQLoHi();
                let v = parseFloat(t.value);
                if (!Number.isFinite(v)) {
                    v = 1;
                }
                v = Math.min(qHi, Math.max(qLo, v));
                let dir = e.code === "ArrowUp" ? 1 : -1;
                let step = e.shiftKey ? 1
                    : (v <= EQ_FILTER_KEYBOARD_Q_FINE_MAX
                        ? EQ_FILTER_KEYBOARD_Q_STEP_FINE
                        : EQ_FILTER_KEYBOARD_Q_STEP);
                let next = v + dir * step;
                next = Math.min(qHi, Math.max(qLo, next));
                if (!e.shiftKey && v <= EQ_FILTER_KEYBOARD_Q_FINE_MAX
                        && step === EQ_FILTER_KEYBOARD_Q_STEP_FINE
                        && next > EQ_FILTER_KEYBOARD_Q_FINE_MAX + 1e-9) {
                    next = EQ_FILTER_KEYBOARD_Q_FINE_MAX + EQ_FILTER_KEYBOARD_Q_STEP;
                }
                if (!e.shiftKey && next <= EQ_FILTER_KEYBOARD_Q_FINE_MAX + 1e-9) {
                    next = Math.round(next * 100) / 100;
                    t.value = next.toFixed(2);
                } else {
                    next = Math.round(next * 10) / 10;
                    t.value = String(next);
                }
                if (rowIx >= 0) {
                    eqGraphWheelQFloat[rowIx] = parseFloat(t.value);
                }
                applyEQ();
                scheduleLiveEqSync();
                eqHistoryNotifyChange();
                return;
            }
            if (nm === "gain") {
                e.preventDefault();
                let [gLo, gHi] = getEqConstraintGainLoHi();
                let v = parseFloat(t.value);
                if (!Number.isFinite(v)) {
                    v = 0;
                }
                v = Math.min(gHi, Math.max(gLo, v));
                let dir = e.code === "ArrowUp" ? 1 : -1;
                let step = e.shiftKey ? 1 : 0.1;
                let next = Math.round((v + dir * step) * 10) / 10;
                t.value = String(Math.min(gHi, Math.max(gLo, next)));
                applyEQ();
                scheduleLiveEqSync();
                eqHistoryNotifyChange();
            }
        }, true);
    }
    let updateEQPhoneTargetSelect = () => {
        if (!eqPhoneTargetSelect || !eqPhoneSelect) {
            return;
        }
        let phoneSelected = eqPhoneSelect.value;
        let targs = activePhones.filter((p) => p.isTarget && p.fullName && !p.fullName.match(/ EQ$/)
            && !isCompensationTargetNameMatch(p));
        let others = activePhones.filter((p) => !p.isTarget && p.fullName && !p.fullName.match(/ EQ$/)
            && (!phoneSelected || p.fullName !== phoneSelected)
            && !isCompensationTargetNameMatch(p));
        let byName = (a, b) => String(a.fullName).localeCompare(String(b.fullName));
        targs.sort(byName);
        others.sort(byName);
        let opts = [];
        let seen = new Set();
        targs.concat(others).forEach((p) => {
            if (!seen.has(p.fullName)) {
                seen.add(p.fullName);
                opts.push(p);
            }
        });
        let oldVal = eqPhoneTargetSelect.value;
        Array.from(eqPhoneTargetSelect.children).slice(1).forEach((c) => eqPhoneTargetSelect.removeChild(c));
        opts.forEach((p) => {
            let o = document.createElement("option");
            o.value = p.fullName;
            let lab = (p.dispName != null && String(p.dispName).trim() !== "") ? String(p.dispName) : p.fullName;
            o.textContent = "Target: " + lab;
            eqPhoneTargetSelect.appendChild(o);
        });
        if (oldVal && Array.from(eqPhoneTargetSelect.options).some((op) => op.value === oldVal)) {
            eqPhoneTargetSelect.value = oldVal;
        } else {
            eqPhoneTargetSelect.value = "";
        }
        if (!eqPhoneTargetSelect.value && opts.length > 0) {
            let modelM = resolveEqModelPhone();
            let implicitT = resolveEqTargetPhone(modelM, "");
            if (implicitT && opts.some((p) => p.fullName === implicitT.fullName)) {
                eqPhoneTargetSelect.value = implicitT.fullName;
            }
        }
        let tgPlaceholder = eqPhoneTargetSelect.querySelector("option[value='']");
        if (tgPlaceholder) {
            tgPlaceholder.textContent = opts.length === 0
                ? "Target: Add a target to the graph"
                : "Choose EQ target";
            let hasTarget = !!eqPhoneTargetSelect.value;
            tgPlaceholder.hidden = hasTarget;
            tgPlaceholder.disabled = hasTarget;
        }
    };
    window.updateEQPhoneSelect = () => {
        let oldValue = eqPhoneSelect.value;
        let optionValues = activePhones.filter(p =>
            !p.isTarget && p.fullName && !p.fullName.match(/ EQ$/)).map(p => p.fullName);
        Array.from(eqPhoneSelect.children).slice(1).forEach(c => eqPhoneSelect.removeChild(c));
        optionValues.forEach(value => {
            let optionElem = document.createElement("option");
            optionElem.setAttribute("value", value);
            optionElem.innerText = value;
            eqPhoneSelect.appendChild(optionElem);
        });
        eqPhoneSelect.value = (optionValues.indexOf(oldValue) >= 0) ? oldValue : "";
        let autoFilledModel = false;
        if (!eqPhoneSelect.value && optionValues.length > 0) {
            eqPhoneSelect.value = optionValues[0];
            autoFilledModel = true;
        }
        updateEQPhoneTargetSelect();
        updateEqFilterMarkers();
        if (autoFilledModel) {
            applyEQ();
            scheduleLiveEqSync();
        }
        let phPlaceholder = eqPhoneSelect.querySelector("option[value='']");
        if (phPlaceholder) {
            phPlaceholder.textContent = optionValues.length === 0
                ? "Add a model to the graph"
                : "Choose EQ model";
            phPlaceholder.hidden = !!eqPhoneSelect.value;
        }
        eqPhoneSelect.dataset.eqLastModel = eqPhoneSelect.value || "";
    };
    window.eqResetParametricAfterBaseModelRemoved = () => {
        eqFiltersUserHasEdited = false;
        eq2chResetAllBanksToDefaultRow();
        filtersToElem([{ disabled: false, type: "PK", freq: 0, q: 0, gain: 0 }]);
        eqFiltersUserHasEdited = false;
        eqPinnedSnapshotBody = null;
        if (eqPhoneSelect) {
            eqPhoneSelect.dataset.eqLastModel = eqPhoneSelect.value || "";
        }
        setEqFilterSelectedRow(null);
        updateEQPhoneTargetSelect();
        applyEQ();
        scheduleLiveEqSync();
        applyParametricEqGraphTraceFocus();
        updateEqTraceOpacity();
        updateEqFilterMarkers();
        eqHistoryRenderLog();
    };
    updateFilterElements();
    updateEqFilterMarkers();
    eqPhoneSelect.addEventListener("input", () => {
        let prev = eqPhoneSelect.dataset.eqLastModel || "";
        let next = eqPhoneSelect.value;
        if (prev && next && prev !== next) {
            let prevPhone = activePhones.filter((p) => p.fullName === prev)[0];
            if (prevPhone && prevPhone.eq) {
                let eqP = prevPhone.eq;
                prevPhone.eq = null;
                eqP.eqParent = null;
                removePhone(eqP);
            }
            eqFiltersUserHasEdited = false;
            eq2chResetAllBanksToDefaultRow();
            filtersToElem([{ disabled: false, type: "PK", freq: 0, q: 0, gain: 0 }]);
            eqFiltersUserHasEdited = false;
            eqPinnedSnapshotBody = null;
            eqHistoryRenderLog();
        }
        eqPhoneSelect.dataset.eqLastModel = next;
        setEqFilterSelectedRow(null);
        updateEQPhoneTargetSelect();
        applyEQ();
        scheduleLiveEqSync();
    });
    eqPhoneSelect.dataset.eqLastModel = eqPhoneSelect.value || "";
    if (eqPhoneTargetSelect) {
        eqPhoneTargetSelect.addEventListener("input", () => {
            applyParametricEqGraphTraceFocus();
            updateEqTraceOpacity();
        });
    }
    let resetParametricEqFilterValuesOnly = () => {
        if (!filterFreqInput || !filterFreqInput.length) {
            return;
        }
        let ch2 = isEqTwoChannelSupportEnabled();
        eqFiltersUserHasEdited = false;
        let bands = Equalizer.config.EqGraphicBandFreqHz;
        if (Array.isArray(bands) && bands.length >= 2) {
            /* applyEQExec flushes DOM to the active bank only; reset must sync all banks before apply. */
            applyEqGraphicModeAuxUiAndBands(ch2 ? { skipApply: true } : undefined);
        } else {
            for (let i = 0; i < eqBands; i++) {
                filterEnabledInput[i].checked = true;
                filterTypeSelect[i].value = "PK";
                filterFreqInput[i].value = "0";
                filterGainInput[i].value = "0";
                filterQInput[i].value = "0";
            }
            applyEqConstraintAttributesToFilterInputs();
            refreshEqFilterConstraintViolationStyles();
            refreshEqFilterInactiveStateForMaxBands();
            if (!ch2) {
                cancelDeferredApplyEQ();
                applyEQExec();
                scheduleLiveEqSync();
            }
        }
        let snap = elemToFilters(true).map((f) => ({
            disabled: !!f.disabled,
            type: f.type,
            freq: f.freq,
            q: f.q,
            gain: f.gain
        }));
        let bankCopy = () => snap.map((row) => ({
            disabled: !!row.disabled,
            type: row.type,
            freq: row.freq,
            q: row.q,
            gain: row.gain
        }));
        if (ch2) {
            eq2chBankData.both = bankCopy();
            eq2chBankData.L = bankCopy();
            eq2chBankData.R = bankCopy();
            cancelDeferredApplyEQ();
            applyEQExec();
            scheduleLiveEqSync();
        } else if (snap.length) {
            eq2chBankData.both = snap;
        }
        eqFiltersUserHasEdited = true;
        setEqFilterSelectedRow(null);
        applyParametricEqGraphTraceFocus();
        updateEqTraceOpacity();
        updateEqFilterMarkers();
        eqHistoryCommitTransaction(undefined, { historyEntry: { kind: "reset" } });
    };
    document.querySelector("div.extra-eq button.extra-eq-reset-btn").addEventListener("click", () => {
        if (!window.confirm("Reset all EQ band values (frequency, Q, and gain) to flat? Constraint presets and limits stay as they are.")) {
            return;
        }
        resetParametricEqFilterValuesOnly();
    });
    // Add new filter
    document.querySelector("div.extra-eq button.add-filter").addEventListener("click", () => {
        if (eqBands >= extraEQBandsMax) {
            return;
        }
        eqFiltersUserHasEdited = true;
        eqBands = Math.min(eqBands + 1, extraEQBandsMax);
        updateFilterElements();
        scheduleLiveEqSync();
        eqHistoryCommitTransaction();
    });
    // Remove last filter
    document.querySelector("div.extra-eq button.remove-filter").addEventListener("click", () => {
        eqFiltersUserHasEdited = true;
        let all = elemToFilters(true);
        let removeHist = null;
        if (eqBands > 1 && all.length) {
            removeHist = { historyEntry: {
                kind: "removeBand",
                removeFreq: +all[all.length - 1].freq || 0
            } };
        }
        eqBands = Math.max(eqBands - 1, 1);
        updateFilterElements();
        applyEQ(); // May removed effective filter
        scheduleLiveEqSync();
        eqHistoryCommitTransaction(undefined, removeHist);
    });
    let resolveEqFilterRowIndexForShortcut = () => {
        /* Prefer graph / row-highlight selection. Focus can stay in another band's input after
           clicking a marker, which used to make ⌘/Alt+Backspace delete the wrong row. */
        if (eqFilterSelectedRow !== null && eqFilterSelectedRow >= 0
                && eqFilterSelectedRow < eqBands) {
            return eqFilterSelectedRow;
        }
        let el = document.activeElement;
        if (el && filtersContainer && filtersContainer.contains(el)) {
            let rowEl = el.closest("div.filter");
            if (rowEl && filtersContainer.contains(rowEl)) {
                let rows = filtersContainer.querySelectorAll("div.filter");
                let ix = Array.prototype.indexOf.call(rows, rowEl);
                if (ix >= 0) {
                    return ix;
                }
            }
        }
        return null;
    };
    let deleteSelectedEqFilterRow = (rowIx) => {
        let ix = rowIx !== undefined && rowIx !== null ? rowIx : eqFilterSelectedRow;
        if (ix === null || ix < 0 || ix >= eqBands) {
            return;
        }
        let all = elemToFilters(true);
        let removeHist = null;
        if (eqBands > 1) {
            removeHist = { historyEntry: {
                kind: "removeBand",
                removeFreq: +all[ix].freq || 0
            } };
            all.splice(ix, 1);
            eqBands = all.length;
            updateFilterElements();
            filtersToElem(all);
            setEqFilterSelectedRow(Math.min(ix, eqBands - 1));
        } else {
            filtersToElem([{ disabled: false, type: "PK", freq: 0, q: 0, gain: 0 }]);
            setEqFilterSelectedRow(0);
        }
        cancelDeferredApplyEQ();
        applyEQExec();
        scheduleLiveEqSync();
        eqHistoryCommitTransaction(undefined, removeHist);
    };
    // Sort filters by frequency
    document.querySelector("div.extra-eq button.sort-filters").addEventListener("click", () => {
        filtersToElem(elemToFilters(true).sort((a, b) =>
            (a.freq || Infinity) - (b.freq || Infinity)));
        scheduleLiveEqSync();
        eqHistoryCommitTransaction();
    });
    // Import filters
    document.querySelector("div.extra-eq button.import-filters").addEventListener("click", () => {
        fileFiltersImport.click();
    });
    fileFiltersImport.addEventListener("change", (e) => {
        // Import filters callback
        let file = e.target.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onerror = () => {
            fileFiltersImport.value = "";
        };
        reader.onload = (re) => {
            try {
            let settings = String(re.target.result || "");
            let parseFilterLineObjects = (blob) => {
                let filters = blob.split("\n").map(l => {
                    let r = String(l == null ? "" : l).match(/Filter\s*\d+:\s*(\S+)\s*(\S+)\s*Fc\s*(\S+)\s*Hz\s*Gain\s*(\S+)\s*dB(\s*Q\s*(\S+))?/);
                    if (!r) { return undefined; }
                    let disabled = (r[1] !== "ON");
                    let type = r[2];
                    let freq = parseInt(r[3]) || 0;
                    let gain = parseFloat(r[4]) || 0;
                    let q = parseFloat(r[6]) || 0;
                    if (type === "LS" || type === "HS") {
                        type += "Q";
                        q = q || 0.707;
                    } else if (type === "LSC" || type === "HSC") {
                        type = type.substr(0, 2) + "Q";
                    }
                    return { disabled, type, freq, q, gain };
                }).filter(f => f);
                while (filters.length > 0) {
                    let lastFilter = filters[filters.length - 1];
                    if (!lastFilter.freq && !lastFilter.q && !lastFilter.gain) {
                        filters.pop();
                    } else {
                        break;
                    }
                }
                return filters;
            };
            if (isEqTwoChannelSupportEnabled() && /^\s*Channel:\s*[LR]/im.test(settings)) {
                let curKey = null;
                let buf = [];
                let flush = (key) => {
                    if (!key) {
                        return;
                    }
                    let filters = parseFilterLineObjects(buf.join("\n"));
                    if (key === "L") {
                        eq2chBankData.L = filters.length ? filters : [eq2chDefaultEmptyRow()];
                    } else if (key === "R") {
                        eq2chBankData.R = filters.length ? filters : [eq2chDefaultEmptyRow()];
                    }
                    buf = [];
                };
                settings.split(/\r?\n/).forEach((line) => {
                    let chm = line.match(/^\s*Channel:\s*([LR])\s*$/i);
                    if (chm) {
                        flush(curKey);
                        curKey = chm[1].toUpperCase();
                        return;
                    }
                    buf.push(line);
                });
                flush(curKey);
                eq2chBankData.both = [eq2chDefaultEmptyRow()];
                if (!eq2chBankData.L || !eq2chBankData.L.length) {
                    eq2chBankData.L = [eq2chDefaultEmptyRow()];
                }
                if (!eq2chBankData.R || !eq2chBankData.R.length) {
                    eq2chBankData.R = [eq2chDefaultEmptyRow()];
                }
                eq2chBankData.L = eq2chPadBankToEqBands(eq2chBankData.L);
                eq2chBankData.R = eq2chPadBankToEqBands(eq2chBankData.R);
                eq2chActiveBank = "both";
                filtersToElem(eq2chPadBankToEqBands(eq2chBankData.both));
                applyEQ();
                scheduleLiveEqSync();
                eqHistoryCommitTransaction();
                return;
            }
            let filters = parseFilterLineObjects(settings);
            if (filters.length > 0) {
                filtersToElem(filters);
                applyEQ();
                scheduleLiveEqSync();
                eqHistoryCommitTransaction();
            } else {
                alert("Parse filters file failed: no filter found.");
            }
            } finally {
                /* Same path twice does not fire "change" unless value is cleared first. */
                fileFiltersImport.value = "";
            }
        };
        reader.readAsText(file);
    });
    // Export filters
    document.querySelector("div.extra-eq button.export-filters").addEventListener("click", () => {
        let phoneSelected = eqPhoneSelect.value;
        let phoneObj = phoneSelected && activePhones.filter(
            p => p.fullName == phoneSelected)[0];
        if (!phoneObj) {
            alert("Please select model and add atleast one filter before export.");
            return;
        }
        eq2chFlushDomToActiveBank();
        let appendExportFilterLines = (settings, filtersArr) => {
            let fi = 0;
            filtersArr.forEach((f) => {
                let filterValid = f.freq != 0 && f.q != 0 && f.gain != 0;
                if (!filterValid) {
                    return;
                }
                fi++;
                let on = (!f.disabled && f.type && f.freq && f.gain && f.q) ? "ON" : "OFF";
                let type = f.type;
                if (type === "LSQ" || type === "HSQ") {
                    type = type.substr(0, 2) + "C";
                }
                settings += ("Filter " + fi + ": " + on + " " + type + " Fc " +
                    f.freq.toFixed(0) + " Hz Gain " + f.gain.toFixed(1) + " dB Q " +
                    f.q.toFixed(3) + "\r\n");
            });
            return settings;
        };
        let settings;
        if (isEqTwoChannelSupportEnabled()) {
            let has2 = eq2chRowsToApplySpecs(eq2chBankData.both).length > 0
                || eq2chRowsToApplySpecs(eq2chBankData.L).length > 0
                || eq2chRowsToApplySpecs(eq2chBankData.R).length > 0;
            if (!has2) {
                alert("Please add atleast one filter before export.");
                return;
            }
            settings = "";
            let base2 = eq2chSharedMeasurementBaseRaw(phoneObj);
            let useSharedBase = Boolean(base2);
            for (let ci = 0; ci < LR.length && ci < phoneObj.rawChannels.length; ci++) {
                let raw = useSharedBase ? base2 : phoneObj.rawChannels[ci];
                if (!raw) {
                    continue;
                }
                let lab = LR[ci] || ("Ch" + (ci + 1));
                let specs = eq2chMergedSpecsForChannelIndex(ci);
                let eqCh = Equalizer.apply(raw, specs);
                let preamp = Equalizer.calc_preamp(raw, eqCh);
                let rowsForFile = elemToFiltersClampedRowsForEqualizerApply(
                    specs.map((s) => ({
                        disabled: false,
                        type: s.type,
                        freq: s.freq,
                        q: s.q,
                        gain: s.gain
                    })), true);
                settings += "Channel: " + lab + "\r\n";
                settings += "Preamp: " + preamp.toFixed(1) + " dB\r\n";
                settings = appendExportFilterLines(settings, rowsForFile);
                settings += "\r\n";
            }
            if (!String(settings).trim()) {
                alert("Please select model with at least one measured channel before export.");
                return;
            }
        } else {
            let filters = elemToFiltersClampedForEqualizerApply(true);
            if (!phoneObj.eq || !filters.length) {
                alert("Please select model and add atleast one filter before export.");
                return;
            }
            let preamp = Equalizer.calc_preamp(
                phoneObj.rawChannels.filter(c => c)[0],
                phoneObj.eq.rawChannels.filter(c => c)[0]);
            settings = "Preamp: " + preamp.toFixed(1) + " dB\r\n";
            settings = appendExportFilterLines(settings, filters);
        }
        let exportElem = document.querySelector("#file-filters-export");
        exportElem.href && URL.revokeObjectURL(exportElem.href);
        exportElem.href = URL.createObjectURL(new Blob([settings]));
        exportElem.download = phoneObj.fullName.replace(/^Uploaded /, "") + " Filters.txt";
        exportElem.click();
    });
    // Export filters as graphic eq (for wavelet)
    document.querySelector("div.extra-eq button.export-graphic-filters").addEventListener("click", () => {
        let phoneSelected = eqPhoneSelect.value;
        let phoneObj = phoneSelected && activePhones.filter(
            p => p.fullName == phoneSelected && p.eq)[0] || { fullName: "Unnamed" };
        eq2chFlushDomToActiveBank();
        let filters;
        if (isEqTwoChannelSupportEnabled()) {
            filters = eq2chMergedSpecsForChannelIndex(0);
        } else {
            filters = elemToFiltersClampedForEqualizerApply();
        }
        if (!filters.length) {
            alert("Please add atleast one filter before export.");
            return;
        }
        let graphicEQ = Equalizer.as_graphic_eq(filters);
        let settings = "GraphicEQ: " + graphicEQ.map(([f, gain]) =>
            f.toFixed(0) + " " + gain.toFixed(1)).join("; ");
        let exportElem = document.querySelector("#file-filters-export");
        exportElem.href && URL.revokeObjectURL(exportElem.href);
        exportElem.href = URL.createObjectURL(new Blob([settings]));
        exportElem.download = phoneObj.fullName.replace(/^Uploaded /, "") + " Graphic Filters.txt";
        exportElem.click();
    });
    // AutoEQ (uses EQ constraints panel for range, Q/gain limits, max bands, and PK/LSQ/HSQ flags)
    let eqConstraintPresetsList = [];
    let eqConstraintDefaultPresetForUi = null;
    let eqConstraintDefaultOptionValueForUi = null;
    let eqConstraintEphemeralCustomSection = false;
    let normalizePresetGraphicBandsFromPreset = (arr) => {
        if (!Array.isArray(arr)) {
            return null;
        }
        let seen = new Set();
        let out = [];
        for (let x of arr) {
            let v = Math.round(Number(x));
            if (!Number.isFinite(v) || v < 20 || v > 20000) {
                continue;
            }
            if (!seen.has(v)) {
                seen.add(v);
                out.push(v);
            }
        }
        out.sort((a, b) => a - b);
        return out.length >= 2 ? out : null;
    };
    let EQ_CONSTRAINT_PRESET_VALUE_CUSTOM = "__custom__";
    /** Built-in preset id for Auto EQ tool constraints (under System; not restored from localStorage on revisit). */
    let EQ_CONSTRAINT_PRESET_AUTO_EQ_ID = "auto-eq";
    let EQ_CONSTRAINT_PRESET_STORAGE_KEY = "eq-constraint-preset-last";
    let EQ_CONSTRAINT_PRESET_LAST_NON_CUSTOM_STORAGE_KEY = "eq-constraint-preset-last-non-custom";
    let EQ_USER_PRESETS_STORAGE_KEY = "eq-constraint-user-presets-v1";
    let EQ_USER_PRESET_PREFIX = "__user:";
    let EQ_ACTION_SAVE_VALUE = "__action_save__";
    let EQ_ACTION_DELETE_VALUE = "__action_delete__";
    let EQ_CONSTRAINT_PRESET_DIVIDER_PREFIX = "__divider__";
    let isEqConstraintPresetDividerValue = (v) => {
        return v != null && String(v).indexOf(EQ_CONSTRAINT_PRESET_DIVIDER_PREFIX) === 0;
    };
    let isEqConstraintUserPresetValue = (v) => {
        return v != null && String(v).indexOf(EQ_USER_PRESET_PREFIX) === 0;
    };
    let isEqConstraintPresetActionValue = (v) => {
        return v === EQ_ACTION_SAVE_VALUE || v === EQ_ACTION_DELETE_VALUE;
    };
    let isEqConstraintPresetJsonEntry = (p) => {
        if (!p || typeof p !== "object") {
            return false;
        }
        let k = String(p.kind || "").toLowerCase();
        if (k === "heading" || k === "section" || k === "divider") {
            return false;
        }
        return true;
    };
    let findEqConstraintPresetByOptionValue = (v) => {
        if (v === "" || v == null || v === EQ_CONSTRAINT_PRESET_VALUE_CUSTOM
                || isEqConstraintPresetDividerValue(v) || isEqConstraintUserPresetValue(v)
                || isEqConstraintPresetActionValue(v)) {
            return null;
        }
        let s = String(v);
        let byId = eqConstraintPresetsList.filter((p) => p && p.id != null && String(p.id) === s)[0];
        if (byId) {
            return byId;
        }
        let ix = parseInt(s, 10);
        if (Number.isFinite(ix) && ix >= 0 && ix < eqConstraintPresetsList.length) {
            return eqConstraintPresetsList[ix];
        }
        return null;
    };
    let zeroEqFilterBandRowInputsIfNotUserEdited = () => {
        if (eqFiltersUserHasEdited || !filterFreqInput || !filterFreqInput.length) {
            return;
        }
        for (let i = 0; i < eqBands; i++) {
            filterEnabledInput[i].checked = true;
            filterTypeSelect[i].value = "PK";
            filterFreqInput[i].value = "0";
            filterGainInput[i].value = "0";
            filterQInput[i].value = "0";
        }
        applyEqConstraintAttributesToFilterInputs();
        refreshEqFilterConstraintViolationStyles();
    };
    let applyEqConstraintPreset = (preset) => {
        if (!preset || typeof preset !== "object") {
            return;
        }
        /* filtersToElem (e.g. after default preset on load) sets this true; graphic presets must still
           run eqGraphicModeApplyAutoTemplateFromBands, which skips entirely while the flag is set. */
        eqFiltersUserHasEdited = false;
        zeroEqFilterBandRowInputsIfNotUserEdited();
        let cRoot = document.querySelector("div.extra-eq .extra-eq-constraints-inner");
        if (!cRoot) {
            return;
        }
        let pkEl = cRoot.querySelector("input.eq-constraint-type-pk");
        let lsqEl = cRoot.querySelector("input.eq-constraint-type-lsq");
        let hsqEl = cRoot.querySelector("input.eq-constraint-type-hsq");
        let mb = cRoot.querySelector("input[name='eq-constraint-max-bands']");
        let fMin = cRoot.querySelector("input[name='eq-constraint-freq-min']");
        let fMax = cRoot.querySelector("input[name='eq-constraint-freq-max']");
        let gList = cRoot.querySelector("input[name='eq-constraint-freq-graphic-list']");
        let gMin = cRoot.querySelector("input[name='eq-constraint-gain-min']");
        let gMax = cRoot.querySelector("input[name='eq-constraint-gain-max']");
        let qMinEl = cRoot.querySelector("input[name='eq-constraint-q-min']");
        let qMaxEl = cRoot.querySelector("input[name='eq-constraint-q-max']");
        if (!pkEl || !lsqEl || !hsqEl || !mb || !fMin || !fMax || !gMin || !gMax || !qMinEl || !qMaxEl) {
            return;
        }
        let prevTwoCh = isEqTwoChannelSupportEnabled();
        let strOrNum = (val, def) => {
            if (val === undefined || val === null) {
                return def;
            }
            return String(val);
        };
        pkEl.checked = preset.allowPk !== false;
        lsqEl.checked = preset.allowLsq !== false;
        hsqEl.checked = preset.allowHsq !== false;
        if (!pkEl.checked && !lsqEl.checked && !hsqEl.checked) {
            pkEl.checked = true;
        }
        let bands = normalizePresetGraphicBandsFromPreset(preset.graphicBandHz);
        if ((!bands || bands.length < 2) && typeof preset.freqGraphicList === "string" && preset.freqGraphicList.trim()) {
            let parsed = parseEqConstraintGraphicFreqList(preset.freqGraphicList);
            bands = parsed.length >= 2 ? parsed : null;
        }
        if (bands && bands.length >= 2) {
            Equalizer.config.EqGraphicBandFreqHz = bands.slice();
            Equalizer.config.AutoEQRange = [bands[0], bands[bands.length - 1]];
            fMin.value = "0";
            fMax.value = "0";
            if (gList) {
                gList.value = bands.join(", ");
            }
            applyEqConstraintFreqRowUiMode();
            mb.value = String(Math.min(bands.length, extraEQBandsMax));
        } else {
            clearEqConstraintGraphicFreqMode();
            fMin.value = strOrNum(preset.freqMin, "0");
            fMax.value = strOrNum(preset.freqMax, "0");
            let maxB = Math.floor(Number(preset.maxBands));
            if (!Number.isFinite(maxB) || maxB < 0) {
                maxB = 0;
            }
            mb.value = maxB <= 0 ? "0" : String(Math.min(maxB, extraEQBandsMax));
        }
        gMin.value = strOrNum(preset.gainMin, "0");
        gMax.value = strOrNum(preset.gainMax, "0");
        qMinEl.value = strOrNum(preset.qMin, "0");
        qMaxEl.value = strOrNum(preset.qMax, "0");
        if (eq2chConstraintToggle) {
            eq2chConstraintToggle.checked = preset.twoChannelSupport === true;
        }
        syncEqConstraintDomToEqualizerConfig();
        let mbDoc = document.querySelector("div.extra-eq input[name='eq-constraint-max-bands']");
        if (mbDoc && !mbDoc.disabled) {
            commitEqMaxBandsFromInput({ writeBackDom: true });
        }
        if (isEqTwoChannelSupportEnabled()) {
            if (!eq2chBankData.both.length) {
                eq2chInitBanksFromCurrentDom();
            }
            eq2chSetTabsVisibility(true);
        } else {
            if (prevTwoCh) {
                eq2chFlushDomToActiveBankCore();
            }
            eq2chActiveBank = "both";
            eq2chBankData.L = [];
            eq2chBankData.R = [];
            eq2chSetTabsVisibility(false);
            /* Bank "both" was often still [] on first load; padding would overwrite graphic EQ rows
               filled moments earlier by applyEqGraphicModeAuxUiAndBands. Mirror DOM into both first. */
            let fromDom = elemToFilters(true).map((f) => ({
                disabled: !!f.disabled,
                type: f.type,
                freq: f.freq,
                q: f.q,
                gain: f.gain
            }));
            if (fromDom.length) {
                eq2chBankData.both = fromDom;
            }
            filtersToElem(eq2chPadBankToEqBands(eq2chBankData.both));
        }
        eq2chSyncBankTabStyles();
    };
    let readUserEqConstraintPresetsFromStorage = () => {
        try {
            let raw = localStorage.getItem(EQ_USER_PRESETS_STORAGE_KEY);
            if (!raw) {
                return [];
            }
            let o = JSON.parse(raw);
            if (o && Array.isArray(o.presets)) {
                return o.presets.filter((p) => p && typeof p === "object" && p.id && p.label);
            }
            if (Array.isArray(o)) {
                return o.filter((p) => p && p.id);
            }
        } catch (e) {
        }
        return [];
    };
    let writeUserEqConstraintPresetsToStorage = (arr) => {
        try {
            localStorage.setItem(EQ_USER_PRESETS_STORAGE_KEY, JSON.stringify({ version: 1, presets: arr }));
        } catch (e) {
        }
    };
    let findUserEqConstraintPresetById = (id) => {
        return readUserEqConstraintPresetsFromStorage().filter((p) => String(p.id) === String(id))[0] || null;
    };
    let generateUserEqConstraintPresetId = () => {
        return EQ_USER_PRESET_PREFIX + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
    };
    let findUserEqConstraintPresetByNormalizedLabel = (label) => {
        let t = String(label || "").trim().toLowerCase();
        if (!t) {
            return null;
        }
        return readUserEqConstraintPresetsFromStorage().find((p) => {
            return String(p.label || "").trim().toLowerCase() === t;
        }) || null;
    };
    let eqConstraintSaveLabelCollidesWithBuiltin = (label) => {
        let t = String(label || "").trim().toLowerCase();
        if (!t) {
            return true;
        }
        let reserved = new Set([
            "none", "default", "custom",
            "save current preset", "save current preset…",
            "+ save current preset", "- delete current preset",
            "delete current preset", "system", "devices"
        ]);
        if (reserved.has(t)) {
            return true;
        }
        if (String(eqConstraintPresetNoneLabel || "").trim().toLowerCase() === t) {
            return true;
        }
        for (let i = 0; i < eqConstraintPresetsList.length; i++) {
            let p = eqConstraintPresetsList[i];
            if (p && p.label && String(p.label).trim().toLowerCase() === t) {
                return true;
            }
        }
        return false;
    };
    let serializeEqConstraintPresetFromDom = () => {
        let cRoot = document.querySelector("div.extra-eq .extra-eq-constraints-inner");
        if (!cRoot) {
            return null;
        }
        let pkEl = cRoot.querySelector("input.eq-constraint-type-pk");
        let lsqEl = cRoot.querySelector("input.eq-constraint-type-lsq");
        let hsqEl = cRoot.querySelector("input.eq-constraint-type-hsq");
        let mb = cRoot.querySelector("input[name='eq-constraint-max-bands']");
        let fMin = cRoot.querySelector("input[name='eq-constraint-freq-min']");
        let fMax = cRoot.querySelector("input[name='eq-constraint-freq-max']");
        let gList = cRoot.querySelector("input[name='eq-constraint-freq-graphic-list']");
        let gMin = cRoot.querySelector("input[name='eq-constraint-gain-min']");
        let gMax = cRoot.querySelector("input[name='eq-constraint-gain-max']");
        let qMinEl = cRoot.querySelector("input[name='eq-constraint-q-min']");
        let qMaxEl = cRoot.querySelector("input[name='eq-constraint-q-max']");
        if (!pkEl || !lsqEl || !hsqEl || !mb || !fMin || !fMax || !gMin || !gMax || !qMinEl || !qMaxEl) {
            return null;
        }
        let row = document.querySelector("div.extra-eq .eq-constraint-freq-row");
        let graphic = row && row.classList.contains("eq-constraint-freq-row-graphic") && gList;
        let o = {
            allowPk: !!pkEl.checked,
            allowLsq: !!lsqEl.checked,
            allowHsq: !!hsqEl.checked,
            maxBands: parseInt(mb.value, 10) || 0,
            freqMin: String(fMin.value != null ? fMin.value : "0"),
            freqMax: String(fMax.value != null ? fMax.value : "0"),
            gainMin: String(gMin.value != null ? gMin.value : "0"),
            gainMax: String(gMax.value != null ? gMax.value : "0"),
            qMin: String(qMinEl.value != null ? qMinEl.value : "0"),
            qMax: String(qMaxEl.value != null ? qMaxEl.value : "0")
        };
        if (graphic && gList && String(gList.value || "").trim()) {
            o.freqGraphicList = String(gList.value || "").trim();
        }
        let ch2 = cRoot.querySelector("input.eq-constraint-2ch-toggle");
        o.twoChannelSupport = !!(ch2 && ch2.checked);
        return o;
    };
    let eqConstraintPresetDisplayPrefix = "Constraints: ";
    let eqConstraintPresetNoneLabel = "None";
    let eqConstraintPresetCustomLabel = "Custom";
    let eqConstraintPresetDomAddPair = (hitParent, dispParent, value, shortLabel, useDispPrefix) => {
        useDispPrefix = useDispPrefix !== false;
        let oHit = document.createElement("option");
        oHit.value = value;
        oHit.textContent = shortLabel;
        hitParent.appendChild(oHit);
        let oDisp = document.createElement("option");
        oDisp.value = value;
        oDisp.textContent = useDispPrefix ? eqConstraintPresetDisplayPrefix + shortLabel : shortLabel;
        dispParent.appendChild(oDisp);
    };
    let eqConstraintPresetDomAddDividerPair = (hitParent, dispParent, value, lineText, ariaLab) => {
        let oHit = document.createElement("option");
        oHit.value = value;
        oHit.disabled = true;
        oHit.setAttribute("aria-disabled", "true");
        oHit.textContent = lineText;
        if (ariaLab) {
            oHit.setAttribute("aria-label", ariaLab);
        }
        hitParent.appendChild(oHit);
        let oDisp = document.createElement("option");
        oDisp.value = value;
        oDisp.disabled = true;
        oDisp.setAttribute("aria-disabled", "true");
        oDisp.textContent = lineText;
        if (ariaLab) {
            oDisp.setAttribute("aria-label", ariaLab);
        }
        dispParent.appendChild(oDisp);
    };
    let eqConstraintPresetProgrammaticSyncDepth = 0;
    let runEqConstraintPresetProgrammatic = (fn, opts) => {
        opts = opts || {};
        eqConstraintPresetProgrammaticSyncDepth++;
        try {
            fn();
            if (opts.recordHistoryAfter) {
                eqHistoryCommitTransaction();
            }
        } finally {
            eqConstraintPresetProgrammaticSyncDepth--;
        }
    };
    let EQ_CONSTRAINT_PRESET_GROUP_SYSTEM = "System";
    let EQ_CONSTRAINT_PRESET_GROUP_CUSTOM = "Custom";
    let EQ_CONSTRAINT_PRESET_GROUP_DEVICES = "Devices";
    let updateEqConstraintConstraintsGearPresetIndicator = () => {
        let gear = document.querySelector("div.extra-eq button.extra-eq-constraints-gear");
        let badge = gear && gear.querySelector(".extra-eq-constraints-gear-preset-badge");
        let row = document.getElementById("eq-constraint-preset-row");
        let hit = document.getElementById("eq-constraint-preset-input");
        if (!gear || !badge) {
            return;
        }
        if (!row || row.hidden || !hit || eqConstraintDefaultOptionValueForUi == null) {
            badge.hidden = true;
            return;
        }
        let stable = String(hit.dataset.eqPresetLastStable || "");
        let defVal = String(eqConstraintDefaultOptionValueForUi);
        badge.hidden = stable === defVal;
    };
    let updateCustomActionDeleteDisabled = (hit, display) => {
        if (!hit || !display) {
            updateEqConstraintConstraintsGearPresetIndicator();
            return;
        }
        let stable = hit.dataset.eqPresetLastStable || "";
        let allow = isEqConstraintUserPresetValue(stable) || stable === EQ_CONSTRAINT_PRESET_VALUE_CUSTOM;
        let dh = hit.querySelector(`option[value='${EQ_ACTION_DELETE_VALUE}']`);
        let dd = display.querySelector(`option[value='${EQ_ACTION_DELETE_VALUE}']`);
        if (dh) {
            dh.disabled = !allow;
        }
        if (dd) {
            dd.disabled = !allow;
        }
        updateEqConstraintConstraintsGearPresetIndicator();
    };
    let shouldShowEqConstraintCustomOptgroup = () => {
        return readUserEqConstraintPresetsFromStorage().length > 0 || eqConstraintEphemeralCustomSection;
    };
    let removeEqConstraintCustomPresetOptgroup = () => {
        let hit = document.getElementById("eq-constraint-preset-input");
        let display = document.getElementById("eq-constraint-preset-display");
        if (!hit || !display) {
            return;
        }
        let ch = hit.querySelector("optgroup[data-eq-preset-custom='1']");
        let cd = display.querySelector("optgroup[data-eq-preset-custom='1']");
        if (ch) {
            ch.remove();
        }
        if (cd) {
            cd.remove();
        }
    };
    let rebuildCustomPresetOptgroupOptions = () => {
        let hit = document.getElementById("eq-constraint-preset-input");
        let display = document.getElementById("eq-constraint-preset-display");
        let row = document.getElementById("eq-constraint-preset-row");
        if (!hit || !display || row.hidden) {
            updateEqConstraintConstraintsGearPresetIndicator();
            return;
        }
        let custHit = hit.querySelector("optgroup[data-eq-preset-custom='1']");
        let custDisp = display.querySelector("optgroup[data-eq-preset-custom='1']");
        if (!custHit || !custDisp) {
            updateEqConstraintConstraintsGearPresetIndicator();
            return;
        }
        let prevVal = hit.value;
        while (custHit.firstChild) {
            custHit.removeChild(custHit.firstChild);
        }
        while (custDisp.firstChild) {
            custDisp.removeChild(custDisp.firstChild);
        }
        let stable = hit.dataset.eqPresetLastStable || "";
        let omitCustomRow = isEqConstraintUserPresetValue(stable) && !eqConstraintEphemeralCustomSection;
        if (!omitCustomRow) {
            eqConstraintPresetDomAddPair(custHit, custDisp, EQ_CONSTRAINT_PRESET_VALUE_CUSTOM, eqConstraintPresetCustomLabel, true);
        }
        readUserEqConstraintPresetsFromStorage().forEach((up) => {
            let lab = String(up.label || "").trim() || "Untitled";
            eqConstraintPresetDomAddPair(custHit, custDisp, String(up.id), lab, true);
        });
        let saveLabel = "+ Save current preset";
        let delLabel = "- Delete current preset";
        eqConstraintPresetDomAddPair(custHit, custDisp, EQ_ACTION_SAVE_VALUE, saveLabel, false);
        eqConstraintPresetDomAddPair(custHit, custDisp, EQ_ACTION_DELETE_VALUE, delLabel, false);
        custHit.querySelectorAll(`option[value='${EQ_ACTION_SAVE_VALUE}'],option[value='${EQ_ACTION_DELETE_VALUE}']`)
            .forEach((o) => {
                o.classList.add("eq-constraint-preset-action-option");
            });
        custDisp.querySelectorAll(`option[value='${EQ_ACTION_SAVE_VALUE}'],option[value='${EQ_ACTION_DELETE_VALUE}']`)
            .forEach((o) => {
                o.classList.add("eq-constraint-preset-action-option");
            });
        let still = Array.from(hit.querySelectorAll("option")).some((o) => !o.disabled && o.value === prevVal);
        if (still) {
            hit.value = prevVal;
        }
        display.selectedIndex = hit.selectedIndex;
        updateCustomActionDeleteDisabled(hit, display);
    };
    let syncEqConstraintCustomPresetOptgroup = () => {
        let hit = document.getElementById("eq-constraint-preset-input");
        let display = document.getElementById("eq-constraint-preset-display");
        let row = document.getElementById("eq-constraint-preset-row");
        if (!hit || !display || row.hidden) {
            updateEqConstraintConstraintsGearPresetIndicator();
            return;
        }
        if (!shouldShowEqConstraintCustomOptgroup()) {
            removeEqConstraintCustomPresetOptgroup();
            updateEqConstraintConstraintsGearPresetIndicator();
            return;
        }
        if (hit.querySelector("optgroup[data-eq-preset-custom='1']")) {
            rebuildCustomPresetOptgroupOptions();
            return;
        }
        let sysHit = hit.querySelector("optgroup[data-eq-preset-system='1']");
        let sysDisp = display.querySelector("optgroup[data-eq-preset-system='1']");
        if (!sysHit || !sysDisp) {
            updateEqConstraintConstraintsGearPresetIndicator();
            return;
        }
        let custHit = document.createElement("optgroup");
        custHit.label = EQ_CONSTRAINT_PRESET_GROUP_CUSTOM;
        custHit.setAttribute("data-eq-preset-custom", "1");
        let custDisp = document.createElement("optgroup");
        custDisp.label = EQ_CONSTRAINT_PRESET_GROUP_CUSTOM;
        custDisp.setAttribute("data-eq-preset-custom", "1");
        hit.insertBefore(custHit, sysHit);
        display.insertBefore(custDisp, sysDisp);
        rebuildCustomPresetOptgroupOptions();
    };
    let notifyEqConstraintUserEditedPresetDropdown = () => {
        if (eqConstraintPresetProgrammaticSyncDepth > 0) {
            return;
        }
        let hit = document.getElementById("eq-constraint-preset-input");
        let display = document.getElementById("eq-constraint-preset-display");
        let row = document.getElementById("eq-constraint-preset-row");
        if (!hit || !display || row.hidden) {
            return;
        }
        let prevStable = hit.dataset.eqPresetLastStable || "";
        if (prevStable !== EQ_CONSTRAINT_PRESET_VALUE_CUSTOM
            && !isEqConstraintPresetActionValue(prevStable)
            && !isEqConstraintPresetDividerValue(prevStable)) {
            try {
                localStorage.setItem(EQ_CONSTRAINT_PRESET_LAST_NON_CUSTOM_STORAGE_KEY, prevStable);
            } catch (err) {
                /* Quota, private mode, or disabled storage */
            }
        }
        eqConstraintEphemeralCustomSection = true;
        syncEqConstraintCustomPresetOptgroup();
        let opt = hit.querySelector(`option[value='${EQ_CONSTRAINT_PRESET_VALUE_CUSTOM}']`);
        if (!opt) {
            updateEqConstraintConstraintsGearPresetIndicator();
            return;
        }
        hit.value = EQ_CONSTRAINT_PRESET_VALUE_CUSTOM;
        display.selectedIndex = hit.selectedIndex;
        hit.dataset.eqPresetLastStable = EQ_CONSTRAINT_PRESET_VALUE_CUSTOM;
        updateCustomActionDeleteDisabled(hit, display);
        persistEqConstraintPresetSelectionToStorage();
    };
    let clearEqConstraintPresetSelection = () => {
        eqFiltersUserHasEdited = false;
        let cRoot = document.querySelector("div.extra-eq .extra-eq-constraints-inner");
        if (!cRoot) {
            return;
        }
        let pkEl = cRoot.querySelector("input.eq-constraint-type-pk");
        let lsqEl = cRoot.querySelector("input.eq-constraint-type-lsq");
        let hsqEl = cRoot.querySelector("input.eq-constraint-type-hsq");
        let mb = cRoot.querySelector("input[name='eq-constraint-max-bands']");
        let fMin = cRoot.querySelector("input[name='eq-constraint-freq-min']");
        let fMax = cRoot.querySelector("input[name='eq-constraint-freq-max']");
        let gMin = cRoot.querySelector("input[name='eq-constraint-gain-min']");
        let gMax = cRoot.querySelector("input[name='eq-constraint-gain-max']");
        let qMinEl = cRoot.querySelector("input[name='eq-constraint-q-min']");
        let qMaxEl = cRoot.querySelector("input[name='eq-constraint-q-max']");
        if (!pkEl || !lsqEl || !hsqEl || !mb || !fMin || !fMax || !gMin || !gMax || !qMinEl || !qMaxEl) {
            return;
        }
        pkEl.checked = true;
        lsqEl.checked = true;
        hsqEl.checked = true;
        clearEqConstraintGraphicFreqMode();
        fMin.value = "0";
        fMax.value = "0";
        mb.value = "0";
        gMin.value = "0";
        gMax.value = "0";
        qMinEl.value = "0";
        qMaxEl.value = "0";
        syncEqConstraintDomToEqualizerConfig();
        let mbDoc = document.querySelector("div.extra-eq input[name='eq-constraint-max-bands']");
        if (mbDoc && !mbDoc.disabled) {
            commitEqMaxBandsFromInput({ writeBackDom: true });
        }
    };
    let syncEqConstraintPresetSelectPair = () => {
        let hit = document.getElementById("eq-constraint-preset-input");
        let display = document.getElementById("eq-constraint-preset-display");
        if (!hit || !display) {
            return;
        }
        display.selectedIndex = hit.selectedIndex;
    };
    let persistEqConstraintPresetSelectionToStorage = () => {
        if (eqConstraintPresetProgrammaticSyncDepth > 0) {
            return;
        }
        let hit = document.getElementById("eq-constraint-preset-input");
        let row = document.getElementById("eq-constraint-preset-row");
        if (!hit || row.hidden) {
            return;
        }
        if (isEqConstraintPresetActionValue(hit.value)) {
            return;
        }
        try {
            localStorage.setItem(EQ_CONSTRAINT_PRESET_STORAGE_KEY, hit.value);
            if (hit.value !== EQ_CONSTRAINT_PRESET_VALUE_CUSTOM) {
                localStorage.setItem(EQ_CONSTRAINT_PRESET_LAST_NON_CUSTOM_STORAGE_KEY, hit.value);
            }
        } catch (err) {
            /* Quota, private mode, or disabled storage */
        }
    };
    let tryRestoreEqConstraintPresetFromStorage = (hit, display) => {
        let saved = null;
        try {
            saved = localStorage.getItem(EQ_CONSTRAINT_PRESET_STORAGE_KEY);
        } catch (err) {
            return false;
        }
        if (saved == null) {
            return false;
        }
        if (isEqConstraintPresetDividerValue(saved) || isEqConstraintPresetActionValue(saved)) {
            return false;
        }
        if (saved === EQ_CONSTRAINT_PRESET_VALUE_CUSTOM) {
            let fb = null;
            try {
                fb = localStorage.getItem(EQ_CONSTRAINT_PRESET_LAST_NON_CUSTOM_STORAGE_KEY);
            } catch (err) {
                return false;
            }
            if (fb == null || fb === EQ_CONSTRAINT_PRESET_VALUE_CUSTOM
                || isEqConstraintPresetDividerValue(fb) || isEqConstraintPresetActionValue(fb)) {
                return false;
            }
            saved = fb;
        }
        /* Auto EQ preset is applied when running the tool from Default; do not re-apply on reload. */
        if (String(saved).toLowerCase() === EQ_CONSTRAINT_PRESET_AUTO_EQ_ID) {
            try {
                localStorage.removeItem(EQ_CONSTRAINT_PRESET_STORAGE_KEY);
                let fbNc = localStorage.getItem(EQ_CONSTRAINT_PRESET_LAST_NON_CUSTOM_STORAGE_KEY);
                if (fbNc != null && String(fbNc).toLowerCase() === EQ_CONSTRAINT_PRESET_AUTO_EQ_ID) {
                    let fallback = eqConstraintDefaultOptionValueForUi != null
                        ? String(eqConstraintDefaultOptionValueForUi)
                        : "default";
                    localStorage.setItem(EQ_CONSTRAINT_PRESET_LAST_NON_CUSTOM_STORAGE_KEY, fallback);
                }
            } catch (err) {
            }
            return false;
        }
        if (isEqConstraintUserPresetValue(saved)) {
            let u = findUserEqConstraintPresetById(saved);
            if (!u) {
                return false;
            }
            let matchedUser = Array.from(hit.querySelectorAll("option")).some((o) => !o.disabled && o.value === saved);
            if (!matchedUser) {
                return false;
            }
            runEqConstraintPresetProgrammatic(() => {
                applyEqConstraintPreset(u);
                hit.value = saved;
                display.selectedIndex = hit.selectedIndex;
                hit.dataset.eqPresetLastStable = saved;
            });
            return true;
        }
        let matched = Array.from(hit.querySelectorAll("option")).some((o) => !o.disabled && o.value === saved);
        if (!matched) {
            return false;
        }
        if (saved === "") {
            runEqConstraintPresetProgrammatic(() => {
                clearEqConstraintPresetSelection();
                hit.value = "";
                display.selectedIndex = hit.selectedIndex;
                hit.dataset.eqPresetLastStable = "";
            });
            return true;
        }
        let p = findEqConstraintPresetByOptionValue(saved);
        if (!p) {
            return false;
        }
        runEqConstraintPresetProgrammatic(() => {
            applyEqConstraintPreset(p);
            hit.value = saved;
            display.selectedIndex = hit.selectedIndex;
            hit.dataset.eqPresetLastStable = saved;
        });
        return true;
    };
    let wireEqConstraintPresetSelectStack = () => {
        let hit = document.getElementById("eq-constraint-preset-input");
        let display = document.getElementById("eq-constraint-preset-display");
        if (!hit || !display || hit.dataset.eqPresetStackWired) {
            return;
        }
        hit.dataset.eqPresetStackWired = "1";
        hit.addEventListener("change", () => {
            syncEqConstraintPresetSelectPair();
            let v = hit.value;
            let prevStable = hit.dataset.eqPresetLastStable || "";
            if (v === EQ_ACTION_SAVE_VALUE) {
                let label = window.prompt("Name for this preset:", "");
                if (label === null) {
                    hit.value = prevStable;
                    display.selectedIndex = hit.selectedIndex;
                    persistEqConstraintPresetSelectionToStorage();
                    updateCustomActionDeleteDisabled(hit, display);
                    return;
                }
                label = String(label).trim();
                if (!label) {
                    hit.value = prevStable;
                    display.selectedIndex = hit.selectedIndex;
                    persistEqConstraintPresetSelectionToStorage();
                    updateCustomActionDeleteDisabled(hit, display);
                    return;
                }
                let blob = serializeEqConstraintPresetFromDom();
                if (!blob) {
                    hit.value = prevStable;
                    display.selectedIndex = hit.selectedIndex;
                    persistEqConstraintPresetSelectionToStorage();
                    updateCustomActionDeleteDisabled(hit, display);
                    return;
                }
                let existingUser = findUserEqConstraintPresetByNormalizedLabel(label);
                if (existingUser) {
                    blob.id = existingUser.id;
                    blob.label = label;
                } else if (eqConstraintSaveLabelCollidesWithBuiltin(label)) {
                    window.alert("That name is reserved or matches a built-in preset. Choose another name.");
                    hit.value = prevStable;
                    display.selectedIndex = hit.selectedIndex;
                    persistEqConstraintPresetSelectionToStorage();
                    updateCustomActionDeleteDisabled(hit, display);
                    return;
                } else {
                    blob.id = generateUserEqConstraintPresetId();
                    blob.label = label;
                }
                let arr = readUserEqConstraintPresetsFromStorage().slice();
                let at = arr.findIndex((p) => String(p.id) === String(blob.id));
                if (at >= 0) {
                    arr[at] = blob;
                } else {
                    arr.push(blob);
                }
                writeUserEqConstraintPresetsToStorage(arr);
                eqConstraintEphemeralCustomSection = false;
                hit.dataset.eqPresetLastStable = blob.id;
                syncEqConstraintCustomPresetOptgroup();
                runEqConstraintPresetProgrammatic(() => {
                    applyEqConstraintPreset(blob);
                    hit.value = blob.id;
                    display.selectedIndex = hit.selectedIndex;
                    hit.dataset.eqPresetLastStable = blob.id;
                }, { recordHistoryAfter: true });
                updateCustomActionDeleteDisabled(hit, display);
                persistEqConstraintPresetSelectionToStorage();
                return;
            }
            if (v === EQ_ACTION_DELETE_VALUE) {
                let delId = prevStable;
                if (delId === EQ_CONSTRAINT_PRESET_VALUE_CUSTOM) {
                    eqConstraintEphemeralCustomSection = false;
                    runEqConstraintPresetProgrammatic(() => {
                        if (eqConstraintDefaultPresetForUi) {
                            applyEqConstraintPreset(eqConstraintDefaultPresetForUi);
                            if (eqConstraintDefaultOptionValueForUi != null) {
                                hit.value = eqConstraintDefaultOptionValueForUi;
                            }
                        } else {
                            clearEqConstraintPresetSelection();
                            hit.value = eqConstraintDefaultOptionValueForUi != null ? eqConstraintDefaultOptionValueForUi : "";
                        }
                        display.selectedIndex = hit.selectedIndex;
                        hit.dataset.eqPresetLastStable = hit.value;
                    }, { recordHistoryAfter: true });
                    syncEqConstraintCustomPresetOptgroup();
                    updateCustomActionDeleteDisabled(hit, display);
                    persistEqConstraintPresetSelectionToStorage();
                    return;
                }
                if (!isEqConstraintUserPresetValue(delId)) {
                    window.alert("Select a saved custom preset or Custom to reset with Delete.");
                    hit.value = prevStable;
                    display.selectedIndex = hit.selectedIndex;
                    persistEqConstraintPresetSelectionToStorage();
                    updateCustomActionDeleteDisabled(hit, display);
                    return;
                }
                let arr = readUserEqConstraintPresetsFromStorage().filter((p) => String(p.id) !== String(delId));
                writeUserEqConstraintPresetsToStorage(arr);
                eqConstraintEphemeralCustomSection = false;
                runEqConstraintPresetProgrammatic(() => {
                    if (eqConstraintDefaultPresetForUi) {
                        applyEqConstraintPreset(eqConstraintDefaultPresetForUi);
                        if (eqConstraintDefaultOptionValueForUi != null) {
                            hit.value = eqConstraintDefaultOptionValueForUi;
                        }
                    } else {
                        clearEqConstraintPresetSelection();
                        hit.value = eqConstraintDefaultOptionValueForUi != null ? eqConstraintDefaultOptionValueForUi : "";
                    }
                    display.selectedIndex = hit.selectedIndex;
                    hit.dataset.eqPresetLastStable = hit.value;
                }, { recordHistoryAfter: true });
                syncEqConstraintCustomPresetOptgroup();
                updateCustomActionDeleteDisabled(hit, display);
                persistEqConstraintPresetSelectionToStorage();
                return;
            }
            if (v === "") {
                eqConstraintEphemeralCustomSection = false;
                runEqConstraintPresetProgrammatic(() => {
                    clearEqConstraintPresetSelection();
                }, { recordHistoryAfter: true });
            } else if (v === EQ_CONSTRAINT_PRESET_VALUE_CUSTOM) {
                eqConstraintEphemeralCustomSection = true;
                /* selection only; constraints unchanged */
            } else if (isEqConstraintPresetDividerValue(v)) {
                /* disabled; should not fire */
            } else if (isEqConstraintUserPresetValue(v)) {
                eqConstraintEphemeralCustomSection = false;
                let u = findUserEqConstraintPresetById(v);
                if (u) {
                    runEqConstraintPresetProgrammatic(() => {
                        applyEqConstraintPreset(u);
                    }, { recordHistoryAfter: true });
                }
            } else {
                eqConstraintEphemeralCustomSection = false;
                let p = findEqConstraintPresetByOptionValue(v);
                if (p) {
                    runEqConstraintPresetProgrammatic(() => {
                        applyEqConstraintPreset(p);
                    }, { recordHistoryAfter: true });
                }
            }
            hit.dataset.eqPresetLastStable = v;
            syncEqConstraintCustomPresetOptgroup();
            updateCustomActionDeleteDisabled(hit, display);
            persistEqConstraintPresetSelectionToStorage();
        });
    };
    let loadEqConstraintPresets = () => {
        let row = document.getElementById("eq-constraint-preset-row");
        let hit = document.getElementById("eq-constraint-preset-input");
        let display = document.getElementById("eq-constraint-preset-display");
        if (!row || !hit || !display) {
            return;
        }
        let url = new URL("equalizer-constraints.json", window.location.href).href;
        fetch(url, { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (!data || !Array.isArray(data.presets) || data.presets.length === 0) {
                    return;
                }
                let defaultPresetObj = null;
                let systemPresetObjs = [];
                let devicesOrderedItems = [];
                let devicePresetOrdinal = 0;
                let dividerOrdinal = 0;
                data.presets.forEach((entry) => {
                    if (!entry || typeof entry !== "object") {
                        return;
                    }
                    let kind = String(entry.kind || "").toLowerCase();
                    if (kind === "heading" || kind === "section") {
                        return;
                    }
                    if (kind === "divider") {
                        let line = entry.text != null && String(entry.text) !== ""
                            ? String(entry.text)
                            : "────────";
                        let ariaLab = entry.label != null && String(entry.label).trim() !== ""
                            ? String(entry.label).trim()
                            : null;
                        devicesOrderedItems.push({
                            itemKind: "divider",
                            line,
                            ariaLab,
                            ordinal: dividerOrdinal++
                        });
                        return;
                    }
                    if (!isEqConstraintPresetJsonEntry(entry)) {
                        return;
                    }
                    let idLc = entry.id != null ? String(entry.id).trim().toLowerCase() : "";
                    if (idLc === "default" || entry.label === "Default") {
                        if (!defaultPresetObj) {
                            defaultPresetObj = entry;
                        }
                        return;
                    }
                    if (idLc === EQ_CONSTRAINT_PRESET_AUTO_EQ_ID || kind === "system") {
                        systemPresetObjs.push(entry);
                        return;
                    }
                    devicesOrderedItems.push({ itemKind: "preset", entry });
                });
                let devicePresetObjs = devicesOrderedItems
                    .filter((x) => x.itemKind === "preset")
                    .map((x) => x.entry);
                eqConstraintPresetsList = defaultPresetObj
                    ? [defaultPresetObj].concat(systemPresetObjs).concat(devicePresetObjs)
                    : systemPresetObjs.concat(devicePresetObjs);
                hit.innerHTML = "";
                display.innerHTML = "";
                let sysHit = document.createElement("optgroup");
                sysHit.label = EQ_CONSTRAINT_PRESET_GROUP_SYSTEM;
                sysHit.setAttribute("data-eq-preset-system", "1");
                let sysDisp = document.createElement("optgroup");
                sysDisp.label = EQ_CONSTRAINT_PRESET_GROUP_SYSTEM;
                sysDisp.setAttribute("data-eq-preset-system", "1");
                hit.appendChild(sysHit);
                display.appendChild(sysDisp);
                eqConstraintPresetDomAddPair(sysHit, sysDisp, "", eqConstraintPresetNoneLabel, true);
                let defaultOptionValue = null;
                if (defaultPresetObj) {
                    defaultOptionValue = defaultPresetObj.id != null && String(defaultPresetObj.id) !== ""
                        ? String(defaultPresetObj.id)
                        : "default";
                    let defLab = defaultPresetObj.label || "Default";
                    eqConstraintPresetDomAddPair(sysHit, sysDisp, defaultOptionValue, defLab, true);
                }
                systemPresetObjs.forEach((entry) => {
                    let val = entry.id != null && String(entry.id).trim() !== ""
                        ? String(entry.id).trim()
                        : "";
                    if (!val) {
                        return;
                    }
                    let lab = entry.label || val;
                    eqConstraintPresetDomAddPair(sysHit, sysDisp, val, lab, true);
                });
                eqConstraintDefaultPresetForUi = defaultPresetObj;
                eqConstraintDefaultOptionValueForUi = defaultOptionValue;
                let devHit = document.createElement("optgroup");
                devHit.label = EQ_CONSTRAINT_PRESET_GROUP_DEVICES;
                devHit.setAttribute("data-eq-preset-devices", "1");
                let devDisp = document.createElement("optgroup");
                devDisp.label = EQ_CONSTRAINT_PRESET_GROUP_DEVICES;
                devDisp.setAttribute("data-eq-preset-devices", "1");
                hit.appendChild(devHit);
                display.appendChild(devDisp);
                devicesOrderedItems.forEach((item) => {
                    if (item.itemKind === "divider") {
                        let v = EQ_CONSTRAINT_PRESET_DIVIDER_PREFIX + item.ordinal;
                        eqConstraintPresetDomAddDividerPair(devHit, devDisp, v, item.line, item.ariaLab);
                        return;
                    }
                    if (item.itemKind !== "preset" || !item.entry) {
                        return;
                    }
                    let entry = item.entry;
                    let val = entry.id != null && String(entry.id) !== ""
                        ? String(entry.id)
                        : String(devicePresetOrdinal);
                    let lab = entry.label || ("Preset " + (devicePresetOrdinal + 1));
                    eqConstraintPresetDomAddPair(devHit, devDisp, val, lab, true);
                    devicePresetOrdinal++;
                });
                row.hidden = false;
                if (readUserEqConstraintPresetsFromStorage().length > 0) {
                    syncEqConstraintCustomPresetOptgroup();
                }
                wireEqConstraintPresetSelectStack();
                let defPreset = defaultPresetObj;
                let restored = tryRestoreEqConstraintPresetFromStorage(hit, display);
                if (!restored) {
                    if (defPreset) {
                        runEqConstraintPresetProgrammatic(() => {
                            applyEqConstraintPreset(defPreset);
                            if (defaultOptionValue != null) {
                                hit.value = defaultOptionValue;
                                display.selectedIndex = hit.selectedIndex;
                            }
                        });
                    } else {
                        runEqConstraintPresetProgrammatic(() => {
                            hit.selectedIndex = 0;
                            display.selectedIndex = 0;
                        });
                    }
                }
                hit.dataset.eqPresetLastStable = hit.value;
                syncEqConstraintCustomPresetOptgroup();
                updateCustomActionDeleteDisabled(hit, display);
                persistEqConstraintPresetSelectionToStorage();
                eqHistoryInitBaselineSnap = eqHistoryTakeSnapshot();
            })
            .catch(() => {
                /* Missing file or fetch error: keep row hidden */
            });
    };
    let eqConstraintsRoot = document.querySelector("div.extra-eq .extra-eq-constraints-inner");
    let eqMaxBandsCommitTimer = null;
    let wireEqConstraintsPanel = () => {
        if (!eqConstraintsRoot) {
            return;
        }
        let onConstraintChange = () => {
            notifyEqConstraintUserEditedPresetDropdown();
            syncEqConstraintDomToEqualizerConfig();
            cancelDeferredApplyEQ();
            applyEQExec();
            scheduleLiveEqSync();
        };
        eqConstraintsRoot.querySelectorAll("input").forEach((inp) => {
            if (inp.name === "eq-constraint-max-bands") {
                inp.addEventListener("input", () => {
                    notifyEqConstraintUserEditedPresetDropdown();
                    if (eqMaxBandsCommitTimer !== null) {
                        clearTimeout(eqMaxBandsCommitTimer);
                    }
                    eqMaxBandsCommitTimer = setTimeout(() => {
                        eqMaxBandsCommitTimer = null;
                        commitEqMaxBandsFromInput({ writeBackDom: true });
                    }, 450);
                });
                inp.addEventListener("change", () => {
                    notifyEqConstraintUserEditedPresetDropdown();
                    if (eqMaxBandsCommitTimer !== null) {
                        clearTimeout(eqMaxBandsCommitTimer);
                        eqMaxBandsCommitTimer = null;
                    }
                    commitEqMaxBandsFromInput({ writeBackDom: true });
                });
                inp.addEventListener("blur", () => {
                    notifyEqConstraintUserEditedPresetDropdown();
                    if (eqMaxBandsCommitTimer !== null) {
                        clearTimeout(eqMaxBandsCommitTimer);
                        eqMaxBandsCommitTimer = null;
                    }
                    commitEqMaxBandsFromInput({ writeBackDom: true });
                });
            } else if (inp.name === "eq-constraint-freq-min" || inp.name === "eq-constraint-freq-max") {
                let onFreqConstraintInput = () => {
                    tryEnterEqConstraintGraphicFreqModeFromTyping();
                    onConstraintChange();
                };
                inp.addEventListener("input", onFreqConstraintInput);
                inp.addEventListener("change", onFreqConstraintInput);
            } else {
                inp.addEventListener("input", onConstraintChange);
                inp.addEventListener("change", onConstraintChange);
            }
        });
    };
    wireEqConstraintsPanel();
    loadEqConstraintPresets();
    applyEqConstraintFreqRowUiMode();
    (() => {
        let eqConstraintsCard = document.querySelector("div.extra-eq .extra-eq-constraints");
        let eqConstraintsGear = document.querySelector("div.extra-eq button.extra-eq-constraints-gear");
        let eqConstraintsBody = document.getElementById("extra-eq-constraints-body");
        if (eqConstraintsGear && eqConstraintsCard && eqConstraintsBody) {
            eqConstraintsGear.addEventListener("click", () => {
                let exp = eqConstraintsCard.classList.toggle("extra-eq-constraints-expanded");
                eqConstraintsGear.setAttribute("aria-expanded", exp ? "true" : "false");
                eqConstraintsBody.setAttribute("aria-hidden", exp ? "false" : "true");
            });
        }
    })();
    syncEqConstraintDomToEqualizerConfig();
    syncEqMaxBandsFieldFromConfig();
    document.querySelector("div.extra-eq button.autoeq").addEventListener("click", () => {
        // Generate filters automatically
        if (isEqConstraintGraphicModeActive()) {
            alert("Auto EQ is not yet available for graphic EQ.");
            return;
        }
        let presetHit = document.getElementById("eq-constraint-preset-input");
        let presetDisplay = document.getElementById("eq-constraint-preset-display");
        let presetRow = document.getElementById("eq-constraint-preset-row");
        if (presetHit && presetDisplay && presetRow && !presetRow.hidden
                && eqConstraintDefaultOptionValueForUi != null) {
            let defV = String(eqConstraintDefaultOptionValueForUi);
            let stable = String(presetHit.dataset.eqPresetLastStable || "");
            let v = String(presetHit.value || "");
            let onDefault = (v === defV || stable === defV);
            if (onDefault) {
                let autoP = findEqConstraintPresetByOptionValue(EQ_CONSTRAINT_PRESET_AUTO_EQ_ID);
                if (autoP) {
                    runEqConstraintPresetProgrammatic(() => {
                        applyEqConstraintPreset(autoP);
                        presetHit.value = EQ_CONSTRAINT_PRESET_AUTO_EQ_ID;
                        presetDisplay.selectedIndex = presetHit.selectedIndex;
                        presetHit.dataset.eqPresetLastStable = EQ_CONSTRAINT_PRESET_AUTO_EQ_ID;
                    }, { recordHistoryAfter: true });
                    syncEqConstraintCustomPresetOptgroup();
                    updateCustomActionDeleteDisabled(presetHit, presetDisplay);
                    persistEqConstraintPresetSelectionToStorage();
                }
            }
        }
        commitEqMaxBandsFromInput({ writeBackDom: true });
        syncEqConstraintDomToEqualizerConfig();
        if (!Equalizer.config.EqAllowedTypes.PK) {
            alert("AutoEQ uses peaking (PK) bands. Enable Peak under Constraints.");
            return;
        }
        let phoneSelected = eqPhoneSelect.value;
        if (!phoneSelected) {
            let firstPhone = eqPhoneSelect.querySelectorAll("option")[1];
            if (firstPhone) {
                phoneSelected = eqPhoneSelect.value = firstPhone.value;
            }
        }
        let phoneObj = phoneSelected && activePhones.filter(
            p => p.fullName == phoneSelected)[0];
        let targetSel = eqPhoneTargetSelect && eqPhoneTargetSelect.value;
        let eqChild = phoneObj && phoneObj.eq;
        let targetObj = resolveEqTargetPhone(phoneObj, targetSel);
        if (!phoneObj || !targetObj) {
            alert("Please select an EQ model and a target trace (or add a target / second model on the graph).");
            return;
        }
        if (phoneObj === targetObj || (phoneObj.fullName && targetObj.fullName && phoneObj.fullName === targetObj.fullName)
                || (eqChild && targetObj === eqChild)) {
            alert("AutoEQ target must be a different trace than the EQ model.");
            return;
        }
        let autoEQOverlay = document.querySelector(".extra-eq-overlay");
        autoEQOverlay.style.display = "block";
        setTimeout(() => {
            commitEqMaxBandsFromInput({ writeBackDom: true });
            syncEqConstraintDomToEqualizerConfig();
            let phoneCHs = (phoneObj.rawChannels.filter(c => c)
                .map(ch => ch.map(([f, v]) => [f, v + phoneObj.norm])));
            let phoneCH = (phoneCHs.length > 1) ? avgCurves(phoneCHs) : phoneCHs[0];
            let targetCH = targetObj.rawChannels.filter(c => c)[0].map(([f, v]) => [f, v + targetObj.norm]);
            let maxBandsForAuto = Math.min(eqBands, getEffectiveEqMaxBands());
            let filters = Equalizer.autoeq(phoneCH, targetCH, maxBandsForAuto);
            filtersToElem(filters);
            applyEQ();
            scheduleLiveEqSync();
            eqHistoryCommitTransaction(undefined, { historyEntry: { kind: "autoeq" } });
            autoEQOverlay.style.display = "none";
        }, 100);
    });
    // Live playback output trim after EQ (linear gain; tune per source)
    let livePinkNoisePlaybackGain = 0.5;
    let liveToneGeneratorPlaybackGain = 0.2;
    let liveMusicPlaybackGain = 1;
    let lastEqPlaybackSource = "pink";
    // Pink noise (parametric EQ in audio path)
    let pinkNoisePlayButton = document.querySelector("div.extra-pink-noise .play");
    let pinkNoisePlaying = false;
    let pinkNoiseContext = null;
    let pinkNoiseProcessor = null;
    let pinkNoiseMasterGain = null;
    let pinkNoiseAnalyser = null;
    let pinkNoiseBiquads = [];
    let pinkNoiseBandFilters = [];
    let pinkNoiseBiquadsLeft = [];
    let pinkNoiseBiquadsRight = [];
    let pinkNoiseBandFiltersLeft = [];
    let pinkNoiseBandFiltersRight = [];
    let pinkNoiseMerger = null;
    let toneGeneratorBiquads = [];
    let toneGeneratorBiquadsLeft = [];
    let toneGeneratorBiquadsRight = [];
    let toneGeneratorBandFiltersLeft = [];
    let toneGeneratorBandFiltersRight = [];
    let toneGeneratorMerger = null;
    let toneGeneratorMasterGain = null;
    let toneGeneratorAnalyser = null;
    let musicBiquads = [];
    let musicBandFilters = [];
    let musicBiquadsLeft = [];
    let musicBiquadsRight = [];
    let musicBandFiltersLeft = [];
    let musicBandFiltersRight = [];
    let musicStereoSplitter = null;
    let musicStereoMerger = null;
    let musicContext = null;
    let musicAudio = null;
    let musicMediaSourceNode = null;
    let musicMasterGain = null;
    let musicAnalyser = null;
    let musicObjectUrl = null;
    let musicFileLoaded = false;
    let musicSeekDragging = false;
    let musicSegStartU = 0;
    let musicSegEndU = 1;
    let musicTrimDragging = null;
    let musicTrimIdleTimer = null;
    /* Segment endpoints in localStorage; audio bytes in IndexedDB (localStorage cannot hold files). */
    let musicRestoreCancelToken = 0;
    const CRINGRAPH_MUSIC_SEG_LS = "cringraph_music_segment_v1";
    const CRINGRAPH_MUSIC_IDB_NAME = "cringraphMusic";
    const CRINGRAPH_MUSIC_IDB_VER = 1;
    const CRINGRAPH_MUSIC_STORE = "track";
    const CRINGRAPH_MUSIC_KEY = "current";
    /* Skip IndexedDB save/restore above this size (typical song ≈3–10 MB; cap avoids quota/slow writes). */
    const CRINGRAPH_MUSIC_MAX_PERSIST_BYTES = 100 * 1024 * 1024;
    let openCringraphMusicDb = () => {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                reject(new Error("no idb"));
                return;
            }
            let req = indexedDB.open(CRINGRAPH_MUSIC_IDB_NAME, CRINGRAPH_MUSIC_IDB_VER);
            req.onupgradeneeded = (ev) => {
                let db = ev.target.result;
                if (!db.objectStoreNames.contains(CRINGRAPH_MUSIC_STORE)) {
                    db.createObjectStore(CRINGRAPH_MUSIC_STORE);
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    };
    let idbPutCringraphMusicRecord = (rec) => {
        return openCringraphMusicDb().then((db) => new Promise((resolve, reject) => {
            let tx = db.transaction(CRINGRAPH_MUSIC_STORE, "readwrite");
            tx.oncomplete = () => {
                db.close();
                resolve();
            };
            tx.onerror = () => {
                db.close();
                reject(tx.error);
            };
            tx.onabort = () => {
                db.close();
                reject(tx.error);
            };
            tx.objectStore(CRINGRAPH_MUSIC_STORE).put(rec, CRINGRAPH_MUSIC_KEY);
        }));
    };
    let idbGetCringraphMusicRecord = () => {
        return openCringraphMusicDb().then((db) => new Promise((resolve, reject) => {
            if (!db.objectStoreNames.contains(CRINGRAPH_MUSIC_STORE)) {
                db.close();
                resolve(null);
                return;
            }
            let tx = db.transaction(CRINGRAPH_MUSIC_STORE, "readonly");
            let getReq = tx.objectStore(CRINGRAPH_MUSIC_STORE).get(CRINGRAPH_MUSIC_KEY);
            getReq.onerror = () => {
                db.close();
                reject(getReq.error);
            };
            tx.oncomplete = () => {
                db.close();
                resolve(getReq.result || null);
            };
        }));
    };
    let idbDeleteCringraphMusicRecord = () => {
        return openCringraphMusicDb().then((db) => new Promise((resolve, reject) => {
            if (!db.objectStoreNames.contains(CRINGRAPH_MUSIC_STORE)) {
                db.close();
                resolve();
                return;
            }
            let tx = db.transaction(CRINGRAPH_MUSIC_STORE, "readwrite");
            tx.oncomplete = () => {
                db.close();
                resolve();
            };
            tx.onerror = () => {
                db.close();
                reject(tx.error);
            };
            tx.objectStore(CRINGRAPH_MUSIC_STORE).delete(CRINGRAPH_MUSIC_KEY);
        })).catch(() => {});
    };
    let loadMusicSegmentFromLocalStorage = () => {
        try {
            let raw = localStorage.getItem(CRINGRAPH_MUSIC_SEG_LS);
            if (!raw) {
                return null;
            }
            let o = JSON.parse(raw);
            if (typeof o.segStartU === "number" && typeof o.segEndU === "number") {
                return { segStartU: o.segStartU, segEndU: o.segEndU };
            }
        } catch (e) { /* noop */ }
        return null;
    };
    let persistMusicSegmentToLocalStorage = () => {
        if (!musicFileLoaded) {
            return;
        }
        try {
            localStorage.setItem(CRINGRAPH_MUSIC_SEG_LS, JSON.stringify({
                v: 1,
                segStartU: musicSegStartU,
                segEndU: musicSegEndU
            }));
        } catch (e) { /* quota / private mode */ }
    };
    let persistMusicFileToIndexedDb = (file) => {
        if (!window.indexedDB || !file) {
            return;
        }
        if (typeof file.size === "number" && file.size > CRINGRAPH_MUSIC_MAX_PERSIST_BYTES) {
            void clearPersistedMusic();
            return;
        }
        idbPutCringraphMusicRecord({
            blob: file,
            name: file.name || "",
            type: file.type || "",
            size: file.size,
            lastModified: file.lastModified
        }).catch(() => {});
    };
    let clearPersistedMusic = () => {
        try {
            localStorage.removeItem(CRINGRAPH_MUSIC_SEG_LS);
        } catch (e) { /* noop */ }
        return idbDeleteCringraphMusicRecord();
    };
    let liveEqSyncRafId = null;
    let livePlaybackEqToggle = document.querySelector("input.live-sound-eq-toggle");
    let isLivePlaybackEqEnabled = () =>
        !livePlaybackEqToggle || livePlaybackEqToggle.checked;
    let mapFilterTypeToBiquad = (t) =>
        (t === "LSQ" ? "lowshelf" : t === "HSQ" ? "highshelf" : "peaking");
    /* Same bands as live biquads; independent of the Compare toggle (used for
       preamp + A/B level match when EQ is bypassed). */
    let elemToLiveEqSpecsClamped = () => {
        let rows;
        if (isEqTwoChannelSupportEnabled()) {
            eq2chFlushDomToActiveBank();
            rows = elemToFiltersClampedRowsForEqualizerApply(
                eq2chPadBankToEqBands(eq2chBankData.both), false).filter(
                (f) => !f.disabled && f.type && f.freq && f.q && f.gain);
        } else {
            rows = elemToFilters();
        }
        return rows.map((f) => ({
            type: f.type,
            freq: Math.min(20000, Math.max(20, f.freq)),
            q: Math.max(1e-4, Math.min(1000, f.q)),
            gain: Math.max(-40, Math.min(40, f.gain)),
        }));
    };
    let computeLiveEqSpecs = () => {
        if (!isLivePlaybackEqEnabled()) {
            return elemToPinnedLivePlaybackSpecs();
        }
        return elemToLiveEqSpecsClamped();
    };
    let liveStereoEqActive = () =>
        isEqTwoChannelSupportEnabled() && isLivePlaybackEqEnabled();
    let liveStereoEqChannelIndices = () => {
        let li = LR.indexOf("L");
        let ri = LR.indexOf("R");
        if (li < 0) {
            li = 0;
        }
        if (ri < 0) {
            ri = LR.length > 1 ? 1 : 0;
        }
        return { li, ri };
    };
    let computeLiveEqSpecsForStereoPaths = () => {
        eq2chFlushDomToActiveBank();
        let { li, ri } = liveStereoEqChannelIndices();
        return {
            specL: eq2chMergedSpecsForChannelIndex(li),
            specR: eq2chMergedSpecsForChannelIndex(ri)
        };
    };
    let getLiveMusicEqFrAnalysis = (sampleRate) => {
        let phoneObj = resolveEqGraphPhoneObj();
        if (!phoneObj || !phoneObj.rawChannels) {
            return null;
        }
        if (liveStereoEqActive()) {
            let { specL, specR } = computeLiveEqSpecsForStereoPaths();
            if (!specL.length && !specR.length) {
                return null;
            }
            let { li, ri } = liveStereoEqChannelIndices();
            let base2 = eq2chSharedMeasurementBaseRaw(phoneObj);
            if (base2) {
                let frEqL = specL.length ? Equalizer.apply(base2, specL, sampleRate) : base2;
                let frEqR = specR.length ? Equalizer.apply(base2, specR, sampleRate) : base2;
                let preL = specL.length ? Equalizer.calc_preamp(base2, frEqL) : 0;
                let preR = specR.length ? Equalizer.calc_preamp(base2, frEqR) : 0;
                return { raw: base2, frEq: frEqL, preDb: (preL + preR) / 2 };
            }
            let rawL = phoneObj.rawChannels[li];
            let rawR = phoneObj.rawChannels[ri];
            if (!rawL || !rawL.length) {
                return null;
            }
            let frEqL = specL.length ? Equalizer.apply(rawL, specL, sampleRate) : rawL;
            let preL = specL.length ? Equalizer.calc_preamp(rawL, frEqL) : 0;
            let preR = preL;
            if (rawR && rawR.length && specR.length) {
                let frEqR = Equalizer.apply(rawR, specR, sampleRate);
                preR = Equalizer.calc_preamp(rawR, frEqR);
            }
            return { raw: rawL, frEq: frEqL, preDb: (preL + preR) / 2 };
        }
        let specs = isLivePlaybackEqEnabled()
            ? elemToLiveEqSpecsClamped()
            : elemToPinnedLivePlaybackSpecs();
        if (!specs.length) {
            return null;
        }
        let raw = phoneObj.rawChannels.filter(Boolean)[0];
        if (!raw || !raw.length) {
            return null;
        }
        let frEq = Equalizer.apply(raw, specs, sampleRate);
        let preDb = Equalizer.calc_preamp(raw, frEq);
        return { raw, frEq, preDb };
    };
    /* Match export semantics: headroom from max EQ boost vs raw FR (see Equalizer.calc_preamp). */
    let computeLiveMusicPreampDb = (sampleRate) => {
        let a = getLiveMusicEqFrAnalysis(sampleRate);
        return a ? a.preDb : 0;
    };
    /* Bypass level-match using the same normalization algorithm as the graph display.
       Returns dB adjustment so that toggling EQ off sounds level-matched. */
    let computeNormBypassAdjustDb = (rawCh, eqCh) => {
        if (!rawCh || !eqCh) return 0;
        if (norm_sel) {
            let i = fr_to_ind(norm_fr);
            if (i < rawCh.length && i < eqCh.length)
                return eqCh[i][1] - rawCh[i][1];
            return 0;
        }
        return find_offset(rawCh, norm_phon) - find_offset(eqCh, norm_phon);
    };
    const LIVE_EQ_PARAM_TAU_SEC = 0.016;
    let smoothAudioParamTo = (param, value, ctx) => {
        let t = ctx.currentTime;
        try {
            param.cancelScheduledValues(t);
            param.setTargetAtTime(value, t, LIVE_EQ_PARAM_TAU_SEC);
        } catch (e) {
            param.value = value;
        }
    };
    let syncMusicOutputGain = (ctx) => {
        if (!musicMasterGain || !ctx) {
            return;
        }
        let preDb = computeLiveMusicPreampDb(ctx.sampleRate);
        let lin = liveMusicPlaybackGain * Math.pow(10, preDb / 20);
        if (!isLivePlaybackEqEnabled()) {
            let a = getLiveMusicEqFrAnalysis(ctx.sampleRate);
            if (a) {
                let adjDb = computeNormBypassAdjustDb(a.raw, a.frEq);
                adjDb = Math.max(-30, Math.min(30, adjDb));
                lin *= Math.pow(10, adjDb / 20);
            }
        }
        smoothAudioParamTo(musicMasterGain.gain, lin, ctx);
    };
    let syncEqBiquadsInPlace = (ctx, biquadsArr, specs) => {
        if (biquadsArr.length !== specs.length) {
            return false;
        }
        for (let i = 0; i < specs.length; i++) {
            let bf = biquadsArr[i];
            let s = specs[i];
            let wantType = mapFilterTypeToBiquad(s.type);
            if (bf.type !== wantType) {
                bf.type = wantType;
            }
            smoothAudioParamTo(bf.frequency, s.freq, ctx);
            smoothAudioParamTo(bf.Q, s.q, ctx);
            smoothAudioParamTo(bf.gain, s.gain, ctx);
        }
        return true;
    };
    let syncBandShelfFiltersInPlace = (ctx, bandArr, fromHz, toHz) => {
        if (!bandArr || bandArr.length !== 2) {
            return false;
        }
        smoothAudioParamTo(bandArr[0].frequency, fromHz, ctx);
        smoothAudioParamTo(bandArr[1].frequency, toHz, ctx);
        return true;
    };
    let readLiveSoundBandEdgeHz = () => {
        let fromEl = document.querySelector("div.live-sound-tools input[name='tone-generator-from']");
        let toEl = document.querySelector("div.live-sound-tools input[name='tone-generator-to']");
        let fromHz = Math.min(Math.max(parseInt(fromEl && fromEl.value) || 0, 20), 20000);
        let toHz = Math.min(Math.max(parseInt(toEl && toEl.value) || 0, fromHz), 20000);
        return { fromHz, toHz };
    };
    let disconnectEqBiquads = (biquadsArr) => {
        biquadsArr.forEach((b) => {
            try { b.disconnect(); } catch (e) { /* noop */ }
        });
        biquadsArr.length = 0;
    };
    let disconnectPinkBandFilters = () => {
        pinkNoiseBandFilters.forEach((b) => {
            try { b.disconnect(); } catch (e) { /* noop */ }
        });
        pinkNoiseBandFilters.length = 0;
        pinkNoiseBandFiltersLeft.forEach((b) => {
            try { b.disconnect(); } catch (e) { /* noop */ }
        });
        pinkNoiseBandFiltersLeft.length = 0;
        pinkNoiseBandFiltersRight.forEach((b) => {
            try { b.disconnect(); } catch (e) { /* noop */ }
        });
        pinkNoiseBandFiltersRight.length = 0;
        if (pinkNoiseMerger) {
            try {
                pinkNoiseMerger.disconnect();
            } catch (e) { /* noop */ }
            pinkNoiseMerger = null;
        }
    };
    let disconnectMusicBandFilters = () => {
        musicBandFilters.forEach((b) => {
            try { b.disconnect(); } catch (e) { /* noop */ }
        });
        musicBandFilters.length = 0;
        musicBandFiltersLeft.forEach((b) => {
            try { b.disconnect(); } catch (e) { /* noop */ }
        });
        musicBandFiltersLeft.length = 0;
        musicBandFiltersRight.forEach((b) => {
            try { b.disconnect(); } catch (e) { /* noop */ }
        });
        musicBandFiltersRight.length = 0;
        if (musicStereoMerger) {
            try {
                musicStereoMerger.disconnect();
            } catch (e) { /* noop */ }
            musicStereoMerger = null;
        }
        if (musicStereoSplitter) {
            try {
                musicStereoSplitter.disconnect();
            } catch (e) { /* noop */ }
            musicStereoSplitter = null;
        }
    };
    let rebuildLiveEqChain = (sourceNode, audioContext, masterGain, biquadsArr) => {
        let specs = computeLiveEqSpecs();
        if (biquadsArr.length === specs.length && specs.length > 0) {
            syncEqBiquadsInPlace(audioContext, biquadsArr, specs);
            return;
        }
        sourceNode.disconnect();
        disconnectEqBiquads(biquadsArr);
        let last = sourceNode;
        if (isLivePlaybackEqEnabled()) {
            specs.forEach((s) => {
                let bf = audioContext.createBiquadFilter();
                bf.type = mapFilterTypeToBiquad(s.type);
                bf.frequency.value = s.freq;
                bf.Q.value = s.q;
                bf.gain.value = s.gain;
                last.connect(bf);
                last = bf;
                biquadsArr.push(bf);
            });
        }
        last.connect(masterGain);
    };
    let rebuildPinkNoiseEqChainStereo = () => {
        if (!pinkNoisePlaying || !pinkNoiseContext || !pinkNoiseProcessor || !pinkNoiseMasterGain) {
            return;
        }
        let { fromHz, toHz } = readLiveSoundBandEdgeHz();
        let { specL, specR } = computeLiveEqSpecsForStereoPaths();
        if (pinkNoiseBandFiltersLeft.length === 2 && pinkNoiseBandFiltersRight.length === 2
                && specL.length === pinkNoiseBiquadsLeft.length
                && specR.length === pinkNoiseBiquadsRight.length
                && syncBandShelfFiltersInPlace(pinkNoiseContext, pinkNoiseBandFiltersLeft, fromHz, toHz)
                && syncBandShelfFiltersInPlace(pinkNoiseContext, pinkNoiseBandFiltersRight, fromHz, toHz)) {
            if ((specL.length === 0 || syncEqBiquadsInPlace(pinkNoiseContext, pinkNoiseBiquadsLeft, specL))
                    && (specR.length === 0 || syncEqBiquadsInPlace(pinkNoiseContext, pinkNoiseBiquadsRight, specR))) {
                return;
            }
        }
        pinkNoiseProcessor.disconnect();
        disconnectEqBiquads(pinkNoiseBiquads);
        disconnectEqBiquads(pinkNoiseBiquadsLeft);
        disconnectEqBiquads(pinkNoiseBiquadsRight);
        disconnectPinkBandFilters();
        pinkNoiseMerger = pinkNoiseContext.createChannelMerger(2);
        let wireSide = (specs, bandArr, bqArr, mergerCh) => {
            let last = pinkNoiseProcessor;
            let hp = pinkNoiseContext.createBiquadFilter();
            hp.type = "highpass";
            hp.frequency.value = fromHz;
            hp.Q.value = 0.707;
            last.connect(hp);
            last = hp;
            bandArr.push(hp);
            let lp = pinkNoiseContext.createBiquadFilter();
            lp.type = "lowpass";
            lp.frequency.value = toHz;
            lp.Q.value = 0.707;
            last.connect(lp);
            last = lp;
            bandArr.push(lp);
            specs.forEach((s) => {
                let bf = pinkNoiseContext.createBiquadFilter();
                bf.type = mapFilterTypeToBiquad(s.type);
                bf.frequency.value = s.freq;
                bf.Q.value = s.q;
                bf.gain.value = s.gain;
                last.connect(bf);
                last = bf;
                bqArr.push(bf);
            });
            last.connect(pinkNoiseMerger, 0, mergerCh);
        };
        wireSide(specL, pinkNoiseBandFiltersLeft, pinkNoiseBiquadsLeft, 0);
        wireSide(specR, pinkNoiseBandFiltersRight, pinkNoiseBiquadsRight, 1);
        pinkNoiseMerger.connect(pinkNoiseMasterGain);
    };
    let rebuildPinkNoiseEqChainMono = () => {
        if (!pinkNoisePlaying || !pinkNoiseContext || !pinkNoiseProcessor || !pinkNoiseMasterGain) {
            return;
        }
        let { fromHz, toHz } = readLiveSoundBandEdgeHz();
        let specs = computeLiveEqSpecs();
        if (pinkNoiseBandFilters.length === 2
                && specs.length === pinkNoiseBiquads.length
                && syncBandShelfFiltersInPlace(pinkNoiseContext, pinkNoiseBandFilters, fromHz, toHz)) {
            if (specs.length === 0 || syncEqBiquadsInPlace(pinkNoiseContext, pinkNoiseBiquads, specs)) {
                return;
            }
        }
        pinkNoiseProcessor.disconnect();
        disconnectEqBiquads(pinkNoiseBiquads);
        disconnectEqBiquads(pinkNoiseBiquadsLeft);
        disconnectEqBiquads(pinkNoiseBiquadsRight);
        disconnectPinkBandFilters();
        let last = pinkNoiseProcessor;
        let hp = pinkNoiseContext.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = fromHz;
        hp.Q.value = 0.707;
        last.connect(hp);
        last = hp;
        pinkNoiseBandFilters.push(hp);
        let lp = pinkNoiseContext.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = toHz;
        lp.Q.value = 0.707;
        last.connect(lp);
        last = lp;
        pinkNoiseBandFilters.push(lp);
        specs.forEach((s) => {
            let bf = pinkNoiseContext.createBiquadFilter();
            bf.type = mapFilterTypeToBiquad(s.type);
            bf.frequency.value = s.freq;
            bf.Q.value = s.q;
            bf.gain.value = s.gain;
            last.connect(bf);
            last = bf;
            pinkNoiseBiquads.push(bf);
        });
        last.connect(pinkNoiseMasterGain);
    };
    let rebuildPinkNoiseEqChain = () => {
        if (!pinkNoisePlaying || !pinkNoiseContext || !pinkNoiseProcessor || !pinkNoiseMasterGain) {
            return;
        }
        if (liveStereoEqActive()) {
            rebuildPinkNoiseEqChainStereo();
        } else {
            rebuildPinkNoiseEqChainMono();
        }
    };
    let rebuildToneGeneratorEqChainStereo = () => {
        if (!toneGeneratorOsc || !toneGeneratorContext || !toneGeneratorMasterGain) {
            return;
        }
        let { fromHz, toHz } = readLiveSoundBandEdgeHz();
        let { specL, specR } = computeLiveEqSpecsForStereoPaths();
        if (toneGeneratorBandFiltersLeft.length === 2 && toneGeneratorBandFiltersRight.length === 2
                && specL.length === toneGeneratorBiquadsLeft.length
                && specR.length === toneGeneratorBiquadsRight.length
                && syncBandShelfFiltersInPlace(toneGeneratorContext, toneGeneratorBandFiltersLeft, fromHz, toHz)
                && syncBandShelfFiltersInPlace(toneGeneratorContext, toneGeneratorBandFiltersRight, fromHz, toHz)) {
            if ((specL.length === 0 || syncEqBiquadsInPlace(toneGeneratorContext, toneGeneratorBiquadsLeft, specL))
                    && (specR.length === 0 || syncEqBiquadsInPlace(toneGeneratorContext, toneGeneratorBiquadsRight, specR))) {
                return;
            }
        }
        toneGeneratorOsc.disconnect();
        disconnectEqBiquads(toneGeneratorBiquads);
        disconnectEqBiquads(toneGeneratorBiquadsLeft);
        disconnectEqBiquads(toneGeneratorBiquadsRight);
        toneGeneratorBandFiltersLeft.forEach((b) => {
            try { b.disconnect(); } catch (e) { /* noop */ }
        });
        toneGeneratorBandFiltersLeft.length = 0;
        toneGeneratorBandFiltersRight.forEach((b) => {
            try { b.disconnect(); } catch (e) { /* noop */ }
        });
        toneGeneratorBandFiltersRight.length = 0;
        if (toneGeneratorMerger) {
            try {
                toneGeneratorMerger.disconnect();
            } catch (e) { /* noop */ }
            toneGeneratorMerger = null;
        }
        toneGeneratorMerger = toneGeneratorContext.createChannelMerger(2);
        let wireSide = (specs, bandArr, bqArr, mergerCh) => {
            let last = toneGeneratorOsc;
            let hp = toneGeneratorContext.createBiquadFilter();
            hp.type = "highpass";
            hp.frequency.value = fromHz;
            hp.Q.value = 0.707;
            last.connect(hp);
            last = hp;
            bandArr.push(hp);
            let lp = toneGeneratorContext.createBiquadFilter();
            lp.type = "lowpass";
            lp.frequency.value = toHz;
            lp.Q.value = 0.707;
            last.connect(lp);
            last = lp;
            bandArr.push(lp);
            specs.forEach((s) => {
                let bf = toneGeneratorContext.createBiquadFilter();
                bf.type = mapFilterTypeToBiquad(s.type);
                bf.frequency.value = s.freq;
                bf.Q.value = s.q;
                bf.gain.value = s.gain;
                last.connect(bf);
                last = bf;
                bqArr.push(bf);
            });
            last.connect(toneGeneratorMerger, 0, mergerCh);
        };
        wireSide(specL, toneGeneratorBandFiltersLeft, toneGeneratorBiquadsLeft, 0);
        wireSide(specR, toneGeneratorBandFiltersRight, toneGeneratorBiquadsRight, 1);
        toneGeneratorMerger.connect(toneGeneratorMasterGain);
    };
    let rebuildToneGeneratorEqChainMono = () => {
        if (!toneGeneratorOsc || !toneGeneratorContext || !toneGeneratorMasterGain) {
            return;
        }
        rebuildLiveEqChain(toneGeneratorOsc, toneGeneratorContext, toneGeneratorMasterGain, toneGeneratorBiquads);
    };
    let rebuildToneGeneratorEqChain = () => {
        if (!toneGeneratorOsc || !toneGeneratorContext || !toneGeneratorMasterGain) {
            return;
        }
        if (liveStereoEqActive()) {
            rebuildToneGeneratorEqChainStereo();
        } else {
            disconnectEqBiquads(toneGeneratorBiquadsLeft);
            disconnectEqBiquads(toneGeneratorBiquadsRight);
            toneGeneratorBandFiltersLeft.forEach((b) => {
                try { b.disconnect(); } catch (e) { /* noop */ }
            });
            toneGeneratorBandFiltersLeft.length = 0;
            toneGeneratorBandFiltersRight.forEach((b) => {
                try { b.disconnect(); } catch (e) { /* noop */ }
            });
            toneGeneratorBandFiltersRight.length = 0;
            if (toneGeneratorMerger) {
                try {
                    toneGeneratorMerger.disconnect();
                } catch (e) { /* noop */ }
                toneGeneratorMerger = null;
            }
            rebuildToneGeneratorEqChainMono();
        }
    };
    let rebuildMusicEqChainStereo = () => {
        if (!musicMediaSourceNode || !musicContext || !musicMasterGain) {
            return;
        }
        let { fromHz, toHz } = readLiveSoundBandEdgeHz();
        let { specL, specR } = computeLiveEqSpecsForStereoPaths();
        if (musicBandFiltersLeft.length === 2 && musicBandFiltersRight.length === 2
                && specL.length === musicBiquadsLeft.length
                && specR.length === musicBiquadsRight.length
                && syncBandShelfFiltersInPlace(musicContext, musicBandFiltersLeft, fromHz, toHz)
                && syncBandShelfFiltersInPlace(musicContext, musicBandFiltersRight, fromHz, toHz)) {
            if ((specL.length === 0 || syncEqBiquadsInPlace(musicContext, musicBiquadsLeft, specL))
                    && (specR.length === 0 || syncEqBiquadsInPlace(musicContext, musicBiquadsRight, specR))) {
                syncMusicOutputGain(musicContext);
                return;
            }
        }
        musicMediaSourceNode.disconnect();
        disconnectEqBiquads(musicBiquads);
        disconnectEqBiquads(musicBiquadsLeft);
        disconnectEqBiquads(musicBiquadsRight);
        disconnectMusicBandFilters();
        musicStereoSplitter = musicContext.createChannelSplitter(2);
        musicStereoMerger = musicContext.createChannelMerger(2);
        musicMediaSourceNode.connect(musicStereoSplitter);
        let wireSide = (splitOut, specs, bandArr, bqArr, mergerCh) => {
            let hp = musicContext.createBiquadFilter();
            hp.type = "highpass";
            hp.frequency.value = fromHz;
            hp.Q.value = 0.707;
            musicStereoSplitter.connect(hp, splitOut);
            let last = hp;
            bandArr.push(hp);
            let lp = musicContext.createBiquadFilter();
            lp.type = "lowpass";
            lp.frequency.value = toHz;
            lp.Q.value = 0.707;
            last.connect(lp);
            last = lp;
            bandArr.push(lp);
            specs.forEach((s) => {
                let bf = musicContext.createBiquadFilter();
                bf.type = mapFilterTypeToBiquad(s.type);
                bf.frequency.value = s.freq;
                bf.Q.value = s.q;
                bf.gain.value = s.gain;
                last.connect(bf);
                last = bf;
                bqArr.push(bf);
            });
            last.connect(musicStereoMerger, 0, mergerCh);
        };
        wireSide(0, specL, musicBandFiltersLeft, musicBiquadsLeft, 0);
        wireSide(1, specR, musicBandFiltersRight, musicBiquadsRight, 1);
        musicStereoMerger.connect(musicMasterGain);
        syncMusicOutputGain(musicContext);
    };
    let rebuildMusicEqChainMono = () => {
        if (!musicMediaSourceNode || !musicContext || !musicMasterGain) {
            return;
        }
        let { fromHz, toHz } = readLiveSoundBandEdgeHz();
        let specs = computeLiveEqSpecs();
        if (musicBandFilters.length === 2
                && specs.length === musicBiquads.length
                && syncBandShelfFiltersInPlace(musicContext, musicBandFilters, fromHz, toHz)) {
            if (specs.length === 0 || syncEqBiquadsInPlace(musicContext, musicBiquads, specs)) {
                syncMusicOutputGain(musicContext);
                return;
            }
        }
        musicMediaSourceNode.disconnect();
        disconnectEqBiquads(musicBiquads);
        disconnectEqBiquads(musicBiquadsLeft);
        disconnectEqBiquads(musicBiquadsRight);
        disconnectMusicBandFilters();
        let last = musicMediaSourceNode;
        let hp = musicContext.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = fromHz;
        hp.Q.value = 0.707;
        last.connect(hp);
        last = hp;
        musicBandFilters.push(hp);
        let lp = musicContext.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = toHz;
        lp.Q.value = 0.707;
        last.connect(lp);
        last = lp;
        musicBandFilters.push(lp);
        specs.forEach((s) => {
            let bf = musicContext.createBiquadFilter();
            bf.type = mapFilterTypeToBiquad(s.type);
            bf.frequency.value = s.freq;
            bf.Q.value = s.q;
            bf.gain.value = s.gain;
            last.connect(bf);
            last = bf;
            musicBiquads.push(bf);
        });
        last.connect(musicMasterGain);
        syncMusicOutputGain(musicContext);
    };
    let rebuildMusicEqChain = () => {
        if (!musicMediaSourceNode || !musicContext || !musicMasterGain) {
            return;
        }
        if (liveStereoEqActive()) {
            rebuildMusicEqChainStereo();
        } else {
            rebuildMusicEqChainMono();
        }
    };
    let scheduleLiveEqSync = () => {
        if (!pinkNoisePlaying && !toneGeneratorOsc && !musicMediaSourceNode) {
            return;
        }
        if (liveEqSyncRafId !== null) {
            return;
        }
        liveEqSyncRafId = requestAnimationFrame(() => {
            liveEqSyncRafId = null;
            rebuildPinkNoiseEqChain();
            rebuildToneGeneratorEqChain();
            rebuildMusicEqChain();
        });
    };
    filtersContainer.addEventListener("input", scheduleLiveEqSync);
    filtersContainer.addEventListener("change", scheduleLiveEqSync);
    if (livePlaybackEqToggle) {
        livePlaybackEqToggle.addEventListener("change", scheduleLiveEqSync);
        livePlaybackEqToggle.addEventListener("change", () => updateEqTraceOpacity());
    }
    let eqTraceOpacityPulseTimer = null;
    let eqTraceLastState = null;
    updateEqTraceOpacity = () => {
        let audioPlaying = pinkNoisePlaying || !!toneGeneratorOsc
            || (musicAudio && !musicAudio.paused);
        let eqOn = isLivePlaybackEqEnabled();
        let stateKey = (audioPlaying ? "p" : "s") + (eqOn ? "1" : "0");
        let stateChanged = eqTraceLastState !== null && eqTraceLastState !== stateKey;
        eqTraceLastState = stateKey;
        let emphTargets = [];
        gpath.selectAll("path").each(function (c) {
            if (!c || !c.p || c.p.hide) return;
            let el = d3.select(this);
            let isEqTrace = !!c.p.eqParent;
            let isParentTrace = !!c.p.eq;
            if (isEqTrace) {
                let bankDim = 1;
                if (isEqTwoChannelSupportEnabled()
                        && eq2chActiveBank !== "both"
                        && LR && LR.length > 1
                        && c.p.activeCurves && c.p.activeCurves.length > 1) {
                    let ix = c.p.activeCurves.indexOf(c);
                    if (ix >= 0 && ix < LR.length) {
                        let side = LR[ix];
                        if ((eq2chActiveBank === "L" && side !== "L")
                                || (eq2chActiveBank === "R" && side !== "R")) {
                            bankDim = 0.5;
                        }
                    }
                }
                let aud = (audioPlaying && !eqOn) ? 0.5 : 1;
                let op = bankDim * aud;
                el.attr("opacity", op === 1 ? null : op);
                if (stateChanged && audioPlaying && eqOn) emphTargets.push(this);
            } else if (isParentTrace) {
                el.attr("opacity", audioPlaying && eqOn ? 0.5 : null);
                if (stateChanged && audioPlaying && !eqOn) emphTargets.push(this);
            }
        });
        if (emphTargets.length) {
            let emph = EQ_GRAPH_TRACE_STROKE_NORMAL * EQ_GRAPH_TRACE_STROKE_EMPH_MULT;
            emphTargets.forEach(n => {
                let d = d3.select(n).datum();
                let w = (d && d.p && d.p.isTarget)
                    ? targetTraceStrokeWidthForPhone(d.p) * EQ_GRAPH_TRACE_STROKE_EMPH_MULT
                    : emph;
                d3.select(n).attr("stroke-width", w);
            });
            if (eqTraceOpacityPulseTimer) clearTimeout(eqTraceOpacityPulseTimer);
            eqTraceOpacityPulseTimer = setTimeout(() => {
                eqTraceOpacityPulseTimer = null;
                emphTargets.forEach(n => {
                    let d = d3.select(n).datum();
                    if (d && d.p && d.p.isTarget) {
                        d3.select(n).attr("stroke-width", targetTraceStrokeWidthForPhone(d.p));
                    } else {
                        let base = n.classList.contains("sample")
                            ? EQ_GRAPH_TRACE_STROKE_SAMPLE
                            : EQ_GRAPH_TRACE_STROKE_NORMAL;
                        d3.select(n).attr("stroke-width", base);
                    }
                });
            }, 100);
        }
        if (!eqGraphPointerState && lastGraphPlotPointerClient) {
            let lp = lastGraphPlotPointerClient;
            let mResync = clientToGraphPlotXY(lp.x, lp.y);
            if (mResync) {
                syncEqHoverPreview(mResync);
            }
        }
    };
    let configureLiveSpectrumAnalyser = (a) => {
        a.fftSize = 2048;
        a.smoothingTimeConstant = 0.82;
        /* getFloatFrequencyData() is clamped to [minDecibels, maxDecibels]; a low max
           flattens loud bass (many bins hit the ceiling → horizontal line on the graph). */
        a.minDecibels = -100;
        a.maxDecibels = 0;
    };
    let disconnectToneGeneratorAnalyser = () => {
        if (toneGeneratorAnalyser) {
            try {
                toneGeneratorAnalyser.disconnect();
            } catch (e) { /* noop */ }
            toneGeneratorAnalyser = null;
        }
    };
    let stopPinkNoisePlayback = () => {
        if (!pinkNoisePlaying) {
            return;
        }
        pinkNoisePlaying = false;
        pinkNoisePlayButton.classList.remove("playback-active");
        if (liveEqSyncRafId !== null) {
            cancelAnimationFrame(liveEqSyncRafId);
            liveEqSyncRafId = null;
        }
        if (pinkNoiseProcessor) {
            pinkNoiseProcessor.disconnect();
            pinkNoiseProcessor.onaudioprocess = null;
            pinkNoiseProcessor = null;
        }
        disconnectEqBiquads(pinkNoiseBiquads);
        disconnectEqBiquads(pinkNoiseBiquadsLeft);
        disconnectEqBiquads(pinkNoiseBiquadsRight);
        disconnectPinkBandFilters();
        if (pinkNoiseMasterGain) {
            pinkNoiseMasterGain.disconnect();
            pinkNoiseMasterGain = null;
        }
        if (pinkNoiseAnalyser) {
            try {
                pinkNoiseAnalyser.disconnect();
            } catch (e) { /* noop */ }
            pinkNoiseAnalyser = null;
        }
        musicSpectrumViz.syncSpectrumViz();
        updateEqTraceOpacity();
    };
    let createPinkNoiseProcessor = (audioContext) => {
        let bufferSize = 4096;
        /* WebKit/Safari: ScriptProcessor with 0 inputs often never runs onaudioprocess (silent output
           while the node graph still looks "active" to the browser). One input channel fixes it;
           we only write the output buffer and do not use the input. */
        let processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        processor.onaudioprocess = (e) => {
            let output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < output.length; i++) {
                let white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                let pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                b6 = white * 0.115926;
                output[i] = pink * 0.11;
            }
        };
        return processor;
    };
    let toneGeneratorFromInput = document.querySelector("div.live-sound-tools input[name='tone-generator-from']");
    let toneGeneratorToInput = document.querySelector("div.live-sound-tools input[name='tone-generator-to']");
    let toneGeneratorSlider = document.querySelector("div.live-sound-tools input[name='tone-generator-freq']");
    let toneGeneratorPlayButton = document.querySelector("div.extra-tone-generator .play");
    let toneGeneratorText = document.querySelector("div.extra-tone-generator .freq-text");
    let toneGeneratorAddFilterButton = document.querySelector(
        "div.extra-tone-generator button.tone-generator-add-filter");
    const TONE_GENERATOR_DEFAULT_HZ = 1000;
    if (toneGeneratorSlider && toneGeneratorFromInput && toneGeneratorToInput && toneGeneratorText) {
        let from = Math.min(Math.max(parseInt(toneGeneratorFromInput.value, 10) || 20, 20), 20000);
        let to = Math.min(Math.max(parseInt(toneGeneratorToInput.value, 10) || from, from), 20000);
        let target = Math.min(Math.max(TONE_GENERATOR_DEFAULT_HZ, from), to);
        if (from < to) {
            let u = (Math.log(target) - Math.log(from)) / (Math.log(to) - Math.log(from));
            toneGeneratorSlider.value = String(Math.min(1, Math.max(0, u)));
        }
        toneGeneratorText.innerText = String(target);
    }
    let musicPlayButton = document.querySelector("div.extra-music .play");
    let musicAddRemoveButton = document.querySelector("div.extra-music button.music-add-remove");
    let musicFileInput = document.querySelector("div.extra-music input.music-file-input");
    let musicCard = document.querySelector("div.extra-music");
    let musicPlaybackPanel = document.querySelector("div.extra-music .music-playback-panel");
    let musicSegmentSliderEl = musicCard && musicCard.querySelector(".music-segment-slider");
    let musicSegmentTrackEl = musicSegmentSliderEl && musicSegmentSliderEl.querySelector(".music-segment-track");
    let musicSegmentSeekEl = musicSegmentTrackEl && musicSegmentTrackEl.querySelector(".music-segment-seek");
    let musicSegmentProgressEl = musicSegmentTrackEl && musicSegmentTrackEl.querySelector(".music-segment-progress");
    let musicSegmentOutsideLeftEl = musicSegmentTrackEl && musicSegmentTrackEl.querySelector(".music-segment-outside-l");
    let musicSegmentOutsideRightEl = musicSegmentTrackEl && musicSegmentTrackEl.querySelector(".music-segment-outside-r");
    let musicSegmentLoopedEl = musicSegmentTrackEl && musicSegmentTrackEl.querySelector(".music-segment-looped");
    let musicSegmentHandleStart = musicSegmentTrackEl && musicSegmentTrackEl.querySelector(".music-segment-handle-start");
    let musicSegmentHandleEnd = musicSegmentTrackEl && musicSegmentTrackEl.querySelector(".music-segment-handle-end");
    let musicSegmentHandleInsetPx = 8;
    let getMusicDuration = () => {
        if (!musicAudio) {
            return 0;
        }
        let d = musicAudio.duration;
        return Number.isFinite(d) && d > 0 ? d : 0;
    };
    let musicSegMinGapU = () => {
        let d = getMusicDuration();
        if (d <= 0) {
            return 0.001;
        }
        let minSec = Math.min(0.15, d * 0.1);
        return minSec / d;
    };
    let clampMusicSegmentBounds = () => {
        let gap = musicSegMinGapU();
        musicSegStartU = Math.max(0, Math.min(1, musicSegStartU));
        musicSegEndU = Math.max(0, Math.min(1, musicSegEndU));
        if (musicSegEndU - musicSegStartU >= gap) {
            return;
        }
        if (musicTrimDragging === "start") {
            musicSegEndU = Math.min(1, musicSegStartU + gap);
        } else if (musicTrimDragging === "end") {
            musicSegStartU = Math.max(0, musicSegEndU - gap);
        } else {
            musicSegEndU = Math.min(1, musicSegStartU + gap);
        }
    };
    let syncMusicSegmentVisuals = () => {
        if (!musicSegmentTrackEl) {
            return;
        }
        let su = musicSegStartU;
        let eu = musicSegEndU;
        let inset = musicSegmentHandleInsetPx;
        let innerSpan = `(100% - ${2 * inset}px)`;
        let innerLeft = (u) => `calc(${inset}px + ${innerSpan} * ${u})`;
        if (musicSegmentOutsideLeftEl) {
            musicSegmentOutsideLeftEl.style.width = innerLeft(su);
        }
        if (musicSegmentOutsideRightEl) {
            musicSegmentOutsideRightEl.style.left = innerLeft(eu);
            musicSegmentOutsideRightEl.style.width = `calc(100% - ${inset}px - ${innerSpan} * ${eu})`;
        }
        if (musicSegmentLoopedEl) {
            musicSegmentLoopedEl.style.left = innerLeft(su);
            musicSegmentLoopedEl.style.width = `calc(${innerSpan} * ${eu - su})`;
        }
        if (musicSegmentHandleStart) {
            musicSegmentHandleStart.style.left = innerLeft(su);
        }
        if (musicSegmentHandleEnd) {
            musicSegmentHandleEnd.style.left = innerLeft(eu);
        }
        let d = getMusicDuration();
        let spanU = Math.max(0, eu - su);
        let uSeg = 0;
        if (d > 0 && spanU > 0 && musicAudio) {
            let t0 = su * d;
            let t1 = eu * d;
            let ct = Math.min(t1, Math.max(t0, musicAudio.currentTime));
            uSeg = (ct - t0) / (t1 - t0);
        }
        if (musicSegmentProgressEl) {
            musicSegmentProgressEl.style.left = innerLeft(su);
            musicSegmentProgressEl.style.width = `calc(${innerSpan} * ${uSeg * spanU})`;
        }
    };
    let pointerToMusicSegmentU = (clientX) => {
        if (!musicSegmentTrackEl) {
            return 0;
        }
        let rect = musicSegmentTrackEl.getBoundingClientRect();
        if (rect.width <= 0) {
            return 0;
        }
        return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    };
    let pointerToMusicHandleU = (clientX) => {
        if (!musicSegmentTrackEl) {
            return 0;
        }
        let rect = musicSegmentTrackEl.getBoundingClientRect();
        let inset = musicSegmentHandleInsetPx;
        let usable = rect.width - 2 * inset;
        if (usable <= 0) {
            return 0.5;
        }
        return Math.min(1, Math.max(0, (clientX - rect.left - inset) / usable));
    };
    let seekMusicToClientX = (clientX) => {
        if (!musicFileLoaded || !musicAudio || !musicSegmentTrackEl) {
            return;
        }
        let d = getMusicDuration();
        if (d <= 0) {
            return;
        }
        let u = pointerToMusicSegmentU(clientX);
        let t = u * d;
        let t0 = musicSegStartU * d;
        let t1 = musicSegEndU * d;
        let margin = Math.min(1e-3, (t1 - t0) * 0.01);
        musicAudio.currentTime = Math.min(t1 - margin, Math.max(t0, t));
        syncMusicSegmentVisuals();
    };
    let musicAudioTimeUpdateHandler = () => {
        if (!musicFileLoaded || !musicAudio) {
            return;
        }
        let d = getMusicDuration();
        if (d <= 0) {
            return;
        }
        let t0 = musicSegStartU * d;
        let t1 = musicSegEndU * d;
        if (!musicAudio.paused && t1 > t0) {
            let span = t1 - t0;
            let wrapEps = Math.min(0.05, Math.max(0.001, span * 0.05));
            if (musicAudio.currentTime >= t1 - wrapEps) {
                musicAudio.currentTime = t0;
            } else if (musicAudio.currentTime + 0.001 < t0) {
                musicAudio.currentTime = t0;
            }
        }
        if (!musicSeekDragging) {
            syncMusicSegmentVisuals();
        }
    };
    let musicAudioEndedHandler = () => {
        if (!musicFileLoaded || !musicAudio) {
            return;
        }
        let d = getMusicDuration();
        if (d <= 0) {
            return;
        }
        musicAudio.currentTime = musicSegStartU * d;
        void startMusicPlayback().catch(() => {
            /* restart after natural EOF may fail without gesture */
        });
    };
    let pauseMusicForLiveSoundSwitch = () => {
        if (!musicAudio || musicAudio.paused) {
            return;
        }
        musicAudio.pause();
        if (musicPlayButton) {
            musicPlayButton.classList.remove("playback-active");
        }
        musicSpectrumViz.syncSpectrumViz();
        updateEqTraceOpacity();
    };
    let toneGeneratorContext = null;
    let toneGeneratorOsc = null;
    let toneGeneratorTimeoutHandle = null;
    let toneSweepRafId = null;
    let toneSweepDurationSec = 6;
    /** log(20k/20); sweep uses log-frequency interpolation — partial ranges use the same share of wall time as on a full 20–20k sweep. */
    const TONE_SWEEP_FULL_LOG_SPAN = Math.log(20000 / 20);
    const TONE_SWEEP_MIN_DURATION_SEC = 2;
    /** Last Space keydown in Extra tab (any live sound source); two within `toneSpaceDoubleMs` → sine sweep. */
    let lastToneSpaceKeydownTime = 0;
    let toneSpaceDoubleMs = 200;
    /** While true, tone sweep restarts from range low when a pass completes (Space held, or 2nd press held past TONE_PLAY_BTN_HOLD_MS on play). */
    let toneSweepLoopSpaceHeld = false;
    let toneSweepLoopPointerHeld = false;
    /** For touch double-press sweep: pointerdown does not get a meaningful UIEvent.detail (unlike mousedown). */
    let tonePlayBtnTouchPrevDownTs = 0;
    const TONE_PLAY_BTN_TOUCH_DOUBLE_MS = 450;
    /** Second click of a double-click: wait this long before treating as "hold" → loop sweep; shorter = normal double-click sweep on mouseup (click detail 2). */
    const TONE_PLAY_BTN_HOLD_MS = 100;
    let tonePlayBtnHoldSweepTimer = null;
    /** Skip mousedown hold-detect when touch just armed the same gesture (both fire on many devices). */
    let tonePlayBtnTouchArmTs = 0;
    /** Master-gain fade to avoid output discontinuities when starting/stopping the sine. */
    const TONE_GEN_FADE_IN_SEC = 0.022;
    const TONE_GEN_FADE_OUT_SEC = 0.042;
    let toneGenFadeCleanupTimer = null;
    let toneSweepPointerHoldUp = () => {
        toneSweepLoopPointerHeld = false;
        document.removeEventListener("pointerup", toneSweepPointerHoldUp, true);
        document.removeEventListener("pointercancel", toneSweepPointerHoldUp, true);
    };
    let tonePlayBtnClearHoldSweepTimer = () => {
        if (tonePlayBtnHoldSweepTimer !== null) {
            clearTimeout(tonePlayBtnHoldSweepTimer);
            tonePlayBtnHoldSweepTimer = null;
        }
    };
    /**
     * Second press of a double-click / double-tap: defer loop sweep until hold exceeds TONE_PLAY_BTN_HOLD_MS.
     * Shorter press: cancel timer — mouse gets a normal click(detail=2) for sweep on mouseup; touch runs onEarlyTapSweep.
     */
    let tonePlayBtnArmLoopHoldAfterSecondPress = (onEarlyTapSweep) => {
        tonePlayBtnClearHoldSweepTimer();
        let settled = false;
        let cancelEarlyUp = (ev) => {
            if (ev.button !== 0) {
                return;
            }
            if (settled) {
                return;
            }
            settled = true;
            document.removeEventListener("pointerup", cancelEarlyUp, true);
            document.removeEventListener("pointercancel", cancelEarlyUp, true);
            tonePlayBtnClearHoldSweepTimer();
            if (typeof onEarlyTapSweep === "function") {
                onEarlyTapSweep();
            }
        };
        document.addEventListener("pointerup", cancelEarlyUp, true);
        document.addEventListener("pointercancel", cancelEarlyUp, true);
        tonePlayBtnHoldSweepTimer = setTimeout(() => {
            if (settled) {
                return;
            }
            settled = true;
            tonePlayBtnHoldSweepTimer = null;
            document.removeEventListener("pointerup", cancelEarlyUp, true);
            document.removeEventListener("pointercancel", cancelEarlyUp, true);
            toneSweepLoopPointerHeld = true;
            document.addEventListener("pointerup", toneSweepPointerHoldUp, true);
            document.addEventListener("pointercancel", toneSweepPointerHoldUp, true);
            startToneGeneratorSweep();
        }, TONE_PLAY_BTN_HOLD_MS);
    };
    let clearToneGenFadeCleanupTimer = () => {
        if (toneGenFadeCleanupTimer !== null) {
            clearTimeout(toneGenFadeCleanupTimer);
            toneGenFadeCleanupTimer = null;
        }
    };
    let toneGeneratorGraphTeardown = () => {
        disconnectEqBiquads(toneGeneratorBiquads);
        disconnectEqBiquads(toneGeneratorBiquadsLeft);
        disconnectEqBiquads(toneGeneratorBiquadsRight);
        toneGeneratorBandFiltersLeft.forEach((b) => {
            try { b.disconnect(); } catch (e) { /* noop */ }
        });
        toneGeneratorBandFiltersLeft.length = 0;
        toneGeneratorBandFiltersRight.forEach((b) => {
            try { b.disconnect(); } catch (e) { /* noop */ }
        });
        toneGeneratorBandFiltersRight.length = 0;
        if (toneGeneratorMerger) {
            try {
                toneGeneratorMerger.disconnect();
            } catch (e) { /* noop */ }
            toneGeneratorMerger = null;
        }
        if (toneGeneratorMasterGain) {
            try {
                toneGeneratorMasterGain.disconnect();
            } catch (e) { /* noop */ }
            toneGeneratorMasterGain = null;
        }
        disconnectToneGeneratorAnalyser();
    };
    /** Ramp output gain to zero, stop the oscillator shortly after, then disconnect the graph after the ramp. */
    let fadeStopToneGeneratorPlayback = () => {
        if (!toneGeneratorOsc || !toneGeneratorContext || !toneGeneratorMasterGain) {
            clearToneGenFadeCleanupTimer();
            toneGeneratorGraphTeardown();
            return;
        }
        if (toneSweepRafId !== null) {
            cancelAnimationFrame(toneSweepRafId);
            toneSweepRafId = null;
        }
        toneSweepPointerHoldUp();
        let ctx = toneGeneratorContext;
        let osc = toneGeneratorOsc;
        let g = toneGeneratorMasterGain.gain;
        let t = ctx.currentTime;
        let rel = TONE_GEN_FADE_OUT_SEC;
        g.cancelScheduledValues(t);
        g.setValueAtTime(g.value, t);
        g.linearRampToValueAtTime(0, t + rel);
        let tStop = t + rel + 0.001;
        try {
            osc.stop(tStop);
        } catch (e) {
            try {
                osc.stop();
            } catch (e2) { /* noop */ }
        }
        toneGeneratorOsc = null;
        toneGeneratorPlayButton.classList.remove("playback-active");
        musicSpectrumViz.syncSpectrumViz();
        updateEqTraceOpacity();
        clearToneGenFadeCleanupTimer();
        let ms = Math.ceil(rel * 1000) + 30;
        toneGenFadeCleanupTimer = setTimeout(() => {
            toneGenFadeCleanupTimer = null;
            toneGeneratorGraphTeardown();
        }, ms);
    };
    const EQ_GRAPH_BASE_GAIN = 0.1;
    /* Movement past this (px) starts a drag; first motion picks freq-only vs gain-only by |dx| vs |dy|. */
    const EQ_GRAPH_DRAG_THRESHOLD_PX = 5;
    /* Hysteresis: lock when pointer (svg space) leaves plot; unlock when it returns inside this inset. */
    const EQ_GRAPH_POINTER_LOCK_INSET = 3;
    let roundEqGraphGainDb = (db) => {
        if (!Number.isFinite(db)) {
            return EQ_GRAPH_BASE_GAIN;
        }
        return Math.round(db * 10) / 10;
    };
    let clampEqGraphGainToInputRange = (db) => {
        let [gLo, gHi] = getEqConstraintGainLoHi();
        return Math.min(gHi, Math.max(gLo, db));
    };
    /** Gain from plot Y vs drag-start ref: 1:1 with graph Y-axis dB (same d3 `y` as curves). */
    let eqGraphGainFromPlotY = (anchorDb, refPlotY, currentPlotY) => {
        let dDb = y.invert(currentPlotY) - y.invert(refPlotY);
        return clampEqGraphGainToInputRange(roundEqGraphGainDb(anchorDb + dDb));
    };
    let scheduleApplyEqDuringGraphDrag = () => {
        if (eqGraphApplyEqDragTimer != null) return;
        eqGraphApplyEqDragTimer = requestAnimationFrame(() => {
            eqGraphApplyEqDragTimer = null;
            cancelDeferredApplyEQ();
            applyEQExec({ skipRestoreFocus: true, liveGraphEqDrag: true });
            scheduleLiveEqSync();
        });
    };
    /** @returns {number} row index, or -1 if max bands */
    let addPeakingFilterFromHz = (hz, initialGain, options) => {
        options = options || {};
        eqFiltersUserHasEdited = true;
        if (initialGain === undefined) {
            initialGain = 0;
        }
        let [fLo, fHi] = getEqConstraintFreqLoHi();
        hz = Math.min(fHi, Math.max(fLo, Math.round(hz)));
        let [gLo, gHi] = getEqConstraintGainLoHi();
        initialGain = Math.min(gHi, Math.max(gLo, initialGain));
        let [qLo, qHi] = getEqConstraintQLoHi();
        let defaultQ = Math.min(qHi, Math.max(qLo, 1));
        let maxA = getEffectiveEqMaxBands();
        let activeBound = Math.min(eqBands, maxA);
        let targetIdx = -1;
        for (let i = 0; i < activeBound; i++) {
            if (filterRowIsAllZeros(i)) {
                targetIdx = i;
                break;
            }
        }
        let focusGainIndex;
        if (targetIdx >= 0) {
            filterEnabledInput[targetIdx].checked = true;
            filterTypeSelect[targetIdx].value = firstAllowedEqFilterType();
            filterFreqInput[targetIdx].value = String(hz);
            filterQInput[targetIdx].value = String(defaultQ);
            filterGainInput[targetIdx].value = String(initialGain);
            focusGainIndex = targetIdx;
        } else if (eqBands < maxA) {
            eqBands = Math.min(eqBands + 1, maxA);
            updateFilterElements();
            let j = eqBands - 1;
            filterEnabledInput[j].checked = true;
            filterTypeSelect[j].value = firstAllowedEqFilterType();
            filterFreqInput[j].value = String(hz);
            filterQInput[j].value = String(defaultQ);
            filterGainInput[j].value = String(initialGain);
            focusGainIndex = j;
        } else {
            alert("No free filter slot within Max filters. Raise the limit or clear a band in the active rows.");
            return -1;
        }
        if (options.skipFocus) {
            cancelDeferredApplyEQ();
            applyEQExec({ skipRestoreFocus: true });
        } else {
            applyEQ();
        }
        scheduleLiveEqSync();
        if (!options.skipFocus) {
            setTimeout(() => {
                let gainEl = filterGainInput[focusGainIndex];
                if (gainEl && !gainEl.disabled) {
                    gainEl.focus();
                    gainEl.select();
                }
            }, 150);
        }
        return focusGainIndex;
    };
    tryEqGraphClickAddFilter = (m) => {
        let st = computeEqNodePreviewAtMouse(m);
        if (!st) {
            return false;
        }
        if (findEqGraphMarkerHit(m)) {
            return false;
        }
        let yOff = y(getOffset(st.tracePhone)) - y(0);
        let cx = x(st.fHz);
        let cy = y(st.db) + yOff;
        if (eqGraphPlotDistPx(m, cx, cy) > EQ_GRAPH_MARKER_HIT_PX) {
            return false;
        }
        /* skipFocus: immediate applyEQExec + updateEqFilterMarkers so syncEqHoverPreview can
           hit the new marker; avoid focusing gain (OS cursor) so the next click can target the graph. */
        let newIx = addPeakingFilterFromHz(st.fHz, EQ_GRAPH_BASE_GAIN, { skipFocus: true });
        if (newIx < 0) {
            return false;
        }
        setEqFilterSelectedRow(newIx, true);
        return true;
    };
    let eqGraphRemoveDragListeners = () => {
        eqGraphRemoveDragSelectLock();
        document.removeEventListener("pointermove", eqGraphDragMove, true);
        document.removeEventListener("pointerup", eqGraphDragEnd, true);
        document.removeEventListener("pointercancel", eqGraphDragEnd, true);
    };
    let eqGraphExitPointerLockIfAny = () => {
        let ex = document.exitPointerLock
            || document.webkitExitPointerLock
            || document.mozExitPointerLock;
        if (ex) {
            try {
                ex.call(document);
            } catch (err) { /* noop */ }
        }
    };
    let eqGraphTypeCycleOrder = { PK: "LSQ", LSQ: "HSQ", HSQ: "PK" };
    let eqGraphPerformDragCleanup = (st, endEvent) => {
        if (st.mode === "soundRange") {
            if (st.soundRangeActive) {
                applyLiveSoundRangeFromHzPair(st.soundRangeAnchorHz, st.soundRangeLastHz);
                let bandEl = document.querySelector("div.live-sound-tools .live-sound-band");
                if (bandEl && typeof bandEl.scrollIntoView === "function") {
                    bandEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
                }
                if (toneGeneratorToInput) {
                    requestAnimationFrame(() => {
                        toneGeneratorToInput.focus();
                        toneGeneratorToInput.select();
                    });
                }
            }
            syncEqSoundRangeBrushFromLiveSoundInputs();
            if (graphPlotHitRect && graphPlotHitRect.node()) {
                graphPlotHitRect.node().style.cursor = "";
            }
            if (endEvent && typeof endEvent.clientX === "number"
                    && typeof endEvent.clientY === "number") {
                lastGraphPlotPointerClient = { x: endEvent.clientX, y: endEvent.clientY };
            }
            eqGraphExitPointerLockIfAny();
            if (st.captureEl) {
                st.captureEl.style.cursor = "";
                try {
                    st.captureEl.releasePointerCapture(st.pointerId);
                } catch (err) { /* noop */ }
            }
            eqGraphRemoveDragListeners();
            cancelAnimationFrame(eqGraphApplyEqDragTimer);
            eqGraphApplyEqDragTimer = null;
            eqGraphPointerState = null;
            eqGraphSkipNextClick = true;
            if (eqGraphSkipClickClearTimer) {
                clearTimeout(eqGraphSkipClickClearTimer);
            }
            eqGraphSkipClickClearTimer = setTimeout(() => {
                eqGraphSkipClickClearTimer = null;
                eqGraphSkipNextClick = false;
            }, 800);
            if (endEvent) {
                let mUp = clientToGraphPlotXY(endEvent.clientX, endEvent.clientY);
                if (mUp) {
                    syncEqHoverPreview(mUp);
                }
            }
            return;
        }
        let didTapAddNewBand = !st.dragging && st.filterIndex === null;
        if (endEvent && typeof endEvent.clientX === "number"
                && typeof endEvent.clientY === "number") {
            lastGraphPlotPointerClient = { x: endEvent.clientX, y: endEvent.clientY };
        }
        eqGraphExitPointerLockIfAny();
        if (st.captureEl) {
            st.captureEl.style.cursor = "";
            try {
                st.captureEl.releasePointerCapture(st.pointerId);
            } catch (err) { /* noop */ }
        }
        eqGraphRemoveDragListeners();
        cancelAnimationFrame(eqGraphApplyEqDragTimer);
        eqGraphApplyEqDragTimer = null;
        eqGraphPointerState = null;
        eqGraphSkipNextClick = true;
        if (eqGraphSkipClickClearTimer) {
            clearTimeout(eqGraphSkipClickClearTimer);
        }
        eqGraphSkipClickClearTimer = setTimeout(() => {
            eqGraphSkipClickClearTimer = null;
            eqGraphSkipNextClick = false;
        }, 800);
        if (didTapAddNewBand) {
            /* Same as graph click-add: immediate markers, no gain focus / refocus steal */
            let newIx = addPeakingFilterFromHz(st.fHz, EQ_GRAPH_BASE_GAIN, { skipFocus: true });
            if (newIx >= 0) {
                setEqFilterSelectedRow(newIx, true);
                eqHistoryCommitTransaction();
            }
        } else if (st.filterIndex !== null && st.dragging) {
            cancelDeferredApplyEQ();
            applyEQExec();
            scheduleLiveEqSync();
            eqHistoryCommitTransaction(st.beforeDragSnap || null);
        }
        if (st.filterIndex !== null && st.dragging && st.axisLock) {
            let ix = st.filterIndex;
            let el = null;
            if (st.axisLock === "gain" && filterGainInput[ix]) {
                el = filterGainInput[ix];
            } else if (st.axisLock === "freq" && filterFreqInput[ix]) {
                el = filterFreqInput[ix];
            }
            /* Touch: focusing number inputs opens the on-screen keyboard; desktop mouse/pen keep focus for editing. */
            if (el && endEvent && endEvent.pointerType !== "touch") {
                requestAnimationFrame(() => {
                    el.focus();
                    el.select();
                });
            }
        }
        if (endEvent) {
            let mUp = clientToGraphPlotXY(endEvent.clientX, endEvent.clientY);
            if (mUp) {
                syncEqHoverPreview(mUp);
            }
            /* Touch has no hover; clear stored client pos for stale hit-tests. */
            if (endEvent.pointerType === "touch") {
                lastGraphPlotPointerClient = null;
            }
        }
    };
    function eqGraphOnPointerLockChange() {
        if (document.pointerLockElement || !eqGraphPointerState) {
            return;
        }
        eqGraphPointerState.pointerLockActive = false;
    }
    document.addEventListener("pointerlockchange", eqGraphOnPointerLockChange);
    function eqGraphDragMove(e) {
        if (!eqGraphPointerState || e.pointerId !== eqGraphPointerState.pointerId) {
            return;
        }
        let st = eqGraphPointerState;
        if (st.mode === "soundRange") {
            let mClient = clientToGraphPlotXY(e.clientX, e.clientY);
            if (!mClient) {
                return;
            }
            let mx = Math.min(pad.l + W, Math.max(pad.l, mClient[0]));
            let [fLoSr, fHiSr] = getEqConstraintFreqLoHi();
            let hz = Math.round(Math.min(fHiSr, Math.max(fLoSr, x.invert(mx))));
            st.soundRangeLastHz = hz;
            let dx = e.clientX - st.startClientX;
            let dy = e.clientY - st.downClientY;
            if (!st.soundRangeActive
                    && Math.abs(dx) >= EQ_GRAPH_DRAG_THRESHOLD_PX
                    && Math.abs(dx) > Math.abs(dy)) {
                st.soundRangeActive = true;
            }
            if (st.soundRangeActive) {
                renderEqSoundRangeBrush(st.soundRangeAnchorHz, st.soundRangeLastHz);
                gEqSoundRangeBrush.raise();
                gEqFilterMarkers.raise();
                gEqHoverPreview.raise();
            }
            lastGraphPlotPointerClient = { x: e.clientX, y: e.clientY };
            syncEqHoverPreview(mClient);
            return;
        }
        let svg = st.captureEl;
        let locked = document.pointerLockElement === svg;
        let coalesced = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : null;
        let eventList = (coalesced && coalesced.length) ? coalesced : [e];
        for (let ei = 0; ei < eventList.length; ei++) {
            let ev = eventList[ei];
            let mx;
            let mClient = null;
            if (locked) {
                st.pointerLockActive = true;
                st.accumMovementX += ev.movementX;
                st.accumMovementY += ev.movementY;
                st.accumPlotY += ev.movementY;
                mx = st.originPlotMx + st.accumMovementX * st.svgScaleX;
                mx = Math.min(pad.l + W, Math.max(pad.l, mx));
                let plotX = st.originPlotMx + st.accumMovementX * st.svgScaleX;
                let plotY = st.originPlotMy + st.accumPlotY * st.svgScaleY;
                let ins = EQ_GRAPH_POINTER_LOCK_INSET;
                if (plotX >= pad.l + ins && plotX <= pad.l + W - ins
                        && plotY >= pad.t + ins && plotY <= pad.t + H - ins) {
                    eqGraphExitPointerLockIfAny();
                    st.pointerLockActive = false;
                }
            } else {
                let refX = ev.clientX - st.grabOffClientX;
                let refY = ev.clientY - st.grabOffClientY;
                mClient = clientToGraphPlotXY(refX, refY);
                if (!mClient) {
                    continue;
                }
                mx = Math.min(pad.l + W, Math.max(pad.l, mClient[0]));
                let rawDy = st.startClientY - refY;
                st.accumMovementX = (mx - st.originPlotMx) / st.svgScaleX;
                st.accumMovementY = -rawDy;
                st.accumPlotY = (mClient[1] - st.originPlotMy) / st.svgScaleY;
                /* Do not request pointer lock: on unlock the OS restores the cursor to the pre-lock
                   position, which desyncs it from the node after a drag. Pointer capture on the SVG
                   already keeps move/up events while the button is held. */
            }
            let currentPlotY = locked
                ? st.originPlotMy + st.accumPlotY * st.svgScaleY
                : mClient[1];
            let gainT = eqGraphGainFromPlotY(
                st.gainDragAnchorDb,
                st.gainDragRefPlotY,
                currentPlotY);
            let [fLoG, fHiG] = getEqConstraintFreqLoHi();
            let freqT = Math.round(Math.min(fHiG, Math.max(fLoG, x.invert(mx))));
            let adx;
            let ady;
            if (locked) {
                if (st.filterIndex === null) {
                    adx = st.accumMovementX;
                    ady = st.accumMovementY;
                } else {
                    adx = st.accumMovementX;
                    ady = st.accumMovementY - st.baseAccumMovementY;
                }
            } else {
                adx = ev.clientX - st.startClientX;
                ady = ev.clientY - st.downClientY;
            }
            if (st.filterIndex === null) {
                let dist = locked
                    ? Math.hypot(st.accumMovementX, st.accumMovementY)
                    : Math.hypot(ev.clientX - st.startClientX, ev.clientY - st.startClientY);
                if (dist < EQ_GRAPH_DRAG_THRESHOLD_PX) {
                    continue;
                }
                /* Before axis lock / addPeakingFilterFromHz: Safari can deliver pointerup reentrantly
                   while this handler runs; didTapAddNewBand uses !dragging — set dragging early so
                   cleanup cannot spawn a duplicate band mid-creation. */
                st.dragging = true;
                if (st.axisLock === null) {
                    st.axisLock = Math.abs(adx) >= Math.abs(ady) ? "freq" : "gain";
                    if (st.axisLock === "freq") {
                        /* Ignore vertical bleed before axis lock: keep gain at pointer-down anchor. */
                        st.lockGainDb = roundEqGraphGainDb(st.gainDragAnchorDb);
                    } else {
                        /* Ignore horizontal bleed before lock: keep freq at drag start. */
                        let [fLoL, fHiL] = getEqConstraintFreqLoHi();
                        st.lockFreqHz = Math.round(Math.min(fHiL, Math.max(fLoL, st.fHz)));
                    }
                }
                let freq = st.axisLock === "freq" ? freqT : st.lockFreqHz;
                let gain = st.axisLock === "gain" ? gainT : st.lockGainDb;
                let idx = addPeakingFilterFromHz(freq, gain, {
                    skipFocus: true,
                });
                if (idx < 0) {
                    eqGraphSkipNextClick = true;
                    eqGraphPointerState = null;
                    eqGraphRemoveDragListeners();
                    eqGraphExitPointerLockIfAny();
                    if (eqGraphSkipClickClearTimer) {
                        clearTimeout(eqGraphSkipClickClearTimer);
                    }
                    eqGraphSkipClickClearTimer = setTimeout(() => {
                        eqGraphSkipClickClearTimer = null;
                        eqGraphSkipNextClick = false;
                    }, 800);
                    if (st.captureEl) {
                        try {
                            st.captureEl.releasePointerCapture(st.pointerId);
                        } catch (err) { /* noop */ }
                    }
                    return;
                }
                st.filterIndex = idx;
                st.liveFHz = freq;
                setEqFilterSelectedRow(idx, true);
                scheduleApplyEqDuringGraphDrag();
                if (st.axisLock === "freq") {
                    syncToneGeneratorToEqFrequencyHz(freq);
                }
                continue;
            }
            let distExisting = locked
                ? Math.hypot(st.accumMovementX,
                    st.accumMovementY - st.baseAccumMovementY)
                : Math.hypot(ev.clientX - st.startClientX,
                    ev.clientY - st.downClientY);
            if (distExisting < EQ_GRAPH_DRAG_THRESHOLD_PX) {
                continue;
            }
            st.dragging = true;
            if (st.axisLock === null) {
                st.axisLock = Math.abs(adx) >= Math.abs(ady) ? "freq" : "gain";
                if (st.axisLock === "freq") {
                    st.lockGainDb = roundEqGraphGainDb(st.gainDragAnchorDb);
                } else {
                    let [fLoL, fHiL] = getEqConstraintFreqLoHi();
                    st.lockFreqHz = Math.round(Math.min(fHiL, Math.max(fLoL, st.fHz)));
                }
            }
            let freq = st.axisLock === "freq" ? freqT : st.lockFreqHz;
            let gain = st.axisLock === "gain" ? gainT : st.lockGainDb;
            st.liveFHz = freq;
            eqFiltersUserHasEdited = true;
            filterFreqInput[st.filterIndex].value = String(freq);
            filterGainInput[st.filterIndex].value = String(gain);
            scheduleApplyEqDuringGraphDrag();
            if (st.axisLock === "freq") {
                syncToneGeneratorToEqFrequencyHz(freq);
            }
        }
        if (!locked) {
            lastGraphPlotPointerClient = { x: e.clientX, y: e.clientY };
        }
    }
    function eqGraphDragEnd(e) {
        if (!eqGraphPointerState || e.pointerId !== eqGraphPointerState.pointerId) {
            return;
        }
        eqGraphPerformDragCleanup(eqGraphPointerState, e);
    }
    function eqGraphPointerDown(e) {
        if (interactInspect) {
            return;
        }
        /* Real touch devices: skip graph pointer path + suppress follow-up synthetic click (EQ add).
           Safari desktop can report pointerType "touch" for trackpad; (pointer: coarse) keeps this
           branch for phones/tablets only so Sound Tools / range drag still work on Mac Safari. */
        if (e.pointerType === "touch" && typeof window.matchMedia === "function"
                && window.matchMedia("(pointer: coarse)").matches) {
            eqGraphSuppressClickAddFromTouch = true;
            if (eqGraphTouchSuppressClearTimer) {
                clearTimeout(eqGraphTouchSuppressClearTimer);
            }
            eqGraphTouchSuppressClearTimer = setTimeout(() => {
                eqGraphTouchSuppressClearTimer = null;
                eqGraphSuppressClickAddFromTouch = false;
            }, 600);
            return;
        }
        if (e.pointerType === "mouse" && e.button !== 0) {
            return;
        }
        let node = graphPlotHitRect && graphPlotHitRect.node();
        if (!node) {
            return;
        }
        let m = clientToGraphPlotXY(e.clientX, e.clientY);
        if (!m) {
            return;
        }
        lastGraphPlotPointerClient = { x: e.clientX, y: e.clientY };
        let hit = findEqGraphMarkerHit(m);
        let stPreview;
        let soundRangeSelect = false;
        let initialAccumMovementY = 0;
        let initialFilterIndex = null;
        let gainDragAnchorDb = EQ_GRAPH_BASE_GAIN;
        if (hit) {
            let g0 = parseFloat(filterGainInput[hit.rowIndex].value) || 0;
            if (!Number.isFinite(g0)) {
                g0 = 0;
            }
            gainDragAnchorDb = g0;
            initialFilterIndex = hit.rowIndex;
            let fCell = parseInt(filterFreqInput[hit.rowIndex].value, 10) || 20;
            stPreview = { fHz: Math.min(20000, Math.max(20, fCell)) };
            setEqFilterSelectedRow(hit.rowIndex, true);
        } else {
            let tabEq = document.querySelector("div.select");
            if (!extraEnabled || !extraEQEnabled || !tabEq
                    || tabEq.getAttribute("data-selected") !== "extra") {
                return;
            }
            stPreview = computeEqNodePreviewAtMouse(m);
            let nearTrace = false;
            if (stPreview) {
                let yOff = y(getOffset(stPreview.tracePhone)) - y(0);
                let cx = x(stPreview.fHz);
                let cy = y(stPreview.db) + yOff;
                nearTrace = eqGraphPlotDistPx(m, cx, cy) <= EQ_GRAPH_MARKER_HIT_PX;
            }
            if (nearTrace) {
                setEqFilterSelectedRow(null);
            } else {
                soundRangeSelect = true;
                setEqFilterSelectedRow(null);
            }
        }
        let svg = node.ownerSVGElement || node;
        let plotRect = svg.getBoundingClientRect();
        let vb = svg.viewBox.baseVal;
        let svgScaleX = vb.width / Math.max(1e-6, plotRect.width);
        let svgScaleY = vb.height / Math.max(1e-6, plotRect.height);
        let grabOffClientX = 0;
        let grabOffClientY = 0;
        let originMx = Math.min(pad.l + W, Math.max(pad.l, m[0]));
        let originMy = Math.min(pad.t + H, Math.max(pad.t, m[1]));
        let startClientYVal = e.clientY;
        if (hit) {
            let nc = graphPlotXYToClient(hit.cx, hit.cy);
            if (nc) {
                grabOffClientX = e.clientX - nc[0];
                grabOffClientY = e.clientY - nc[1];
                startClientYVal = nc[1];
                originMx = hit.cx;
                originMy = hit.cy;
            }
        }
        let gainDragRefPlotY = originMy;
        let mxClampFreq = Math.min(pad.l + W, Math.max(pad.l, m[0]));
        let [fLoPtr, fHiPtr] = getEqConstraintFreqLoHi();
        let freqAtPointer = Math.round(Math.min(fHiPtr, Math.max(fLoPtr, x.invert(mxClampFreq))));
        let previewFHz = stPreview ? stPreview.fHz : freqAtPointer;
        cancelAnimationFrame(eqGraphApplyEqDragTimer);
        eqGraphApplyEqDragTimer = null;
        pathHL(false);
        if (!soundRangeSelect) {
            eqHistoryPendingPreEditSnap = null;
        }
        eqGraphPointerState = {
            mode: soundRangeSelect ? "soundRange" : "eq",
            soundRangeAnchorHz: soundRangeSelect ? freqAtPointer : null,
            soundRangeLastHz: soundRangeSelect ? freqAtPointer : null,
            soundRangeActive: false,
            startClientX: e.clientX,
            startClientY: startClientYVal,
            grabOffClientX: grabOffClientX,
            grabOffClientY: grabOffClientY,
            downClientY: e.clientY,
            fHz: soundRangeSelect ? freqAtPointer : previewFHz,
            liveFHz: soundRangeSelect ? freqAtPointer : previewFHz,
            filterIndex: initialFilterIndex,
            dragging: false,
            axisLock: null,
            lockFreqHz: null,
            lockGainDb: null,
            gainDragAnchorDb: gainDragAnchorDb,
            gainDragRefPlotY: gainDragRefPlotY,
            pointerId: e.pointerId,
            captureEl: svg,
            originPlotMx: originMx,
            originPlotMy: originMy,
            accumMovementX: 0,
            accumMovementY: initialAccumMovementY,
            baseAccumMovementY: initialAccumMovementY,
            accumPlotY: 0,
            svgScaleX: svgScaleX,
            svgScaleY: svgScaleY,
            pointerLockActive: false,
            beforeDragSnap: (!soundRangeSelect && initialFilterIndex !== null)
                ? eqHistoryTakeSnapshot()
                : null,
        };
        /* Sound Tools range drag: avoid preventDefault so Safari keeps default gesture handling;
           EQ drag still uses it to block stray text selection. Selection lock is fine for both. */
        if (!soundRangeSelect) {
            e.preventDefault();
        }
        eqGraphInstallDragSelectLock();
        svg.style.cursor = "grabbing";
        if (graphPlotHitRect && graphPlotHitRect.node()) {
            graphPlotHitRect.node().style.cursor = "grabbing";
        }
        try {
            svg.setPointerCapture(e.pointerId);
        } catch (err) { /* noop */ }
        document.addEventListener("pointermove", eqGraphDragMove, true);
        document.addEventListener("pointerup", eqGraphDragEnd, true);
        document.addEventListener("pointercancel", eqGraphDragEnd, true);
    }
    /* Wheel Q: normalize to ~pixel scale, then sublinear steps. Above Q_FINE_MAX use 0.1; at that
       value and below use 0.01 for smoother low-Q tweaks. Sensitivity tapers toward Qmin; a float per
       band accumulates until rounding (manual Q edits resync via |float − input|). */
    /* Keep in sync with EQ_FILTER_KEYBOARD_Q_* (parametric row arrow keys in filtersContainer). */
    const EQ_GRAPH_WHEEL_Q_STEP = 0.1;
    const EQ_GRAPH_WHEEL_Q_STEP_FINE = 0.01;
    const EQ_GRAPH_WHEEL_Q_FINE_MAX = 0.3;
    const EQ_GRAPH_WHEEL_Q_SYNC_TOL_FINE = 0.009;
    const EQ_GRAPH_WHEEL_SENS_REF_PX = 42;
    const EQ_GRAPH_WHEEL_MAX_STEPS = 5;
    const EQ_GRAPH_WHEEL_Q_SENS_KNEE = 2;
    const EQ_GRAPH_WHEEL_Q_SENS_FLOOR = 0.22;
    const EQ_GRAPH_WHEEL_Q_SENS_GAMMA = 1.2;
    let eqGraphWheelQFloat = Object.create(null);
    let eqGraphWheelQSensitivity = (q) => {
        if (!Number.isFinite(q)) {
            return 1;
        }
        if (q >= EQ_GRAPH_WHEEL_Q_SENS_KNEE) {
            return 1;
        }
        let t = (q - 0.1) / (EQ_GRAPH_WHEEL_Q_SENS_KNEE - 0.1);
        t = Math.max(0, Math.min(1, t));
        return EQ_GRAPH_WHEEL_Q_SENS_FLOOR
            + (1 - EQ_GRAPH_WHEEL_Q_SENS_FLOOR) * Math.pow(t, EQ_GRAPH_WHEEL_Q_SENS_GAMMA);
    };
    function eqGraphPlotWheel(e) {
        if (eqGraphPointerState || interactInspect) {
            return;
        }
        let tab = document.querySelector("div.select");
        if (!extraEnabled || !extraEQEnabled || !tab
                || tab.getAttribute("data-selected") !== "extra") {
            return;
        }
        let m = clientToGraphPlotXY(e.clientX, e.clientY);
        if (!m) {
            return;
        }
        let hit = findEqGraphMarkerHit(m);
        if (!hit) {
            return;
        }
        e.preventDefault();
        let i = hit.rowIndex;
        let qDisplay = parseFloat(filterQInput[i].value);
        if (!Number.isFinite(qDisplay)) {
            qDisplay = 1;
        }
        let qFloat = eqGraphWheelQFloat[i];
        let qSyncTol = qDisplay <= EQ_GRAPH_WHEEL_Q_FINE_MAX
            ? EQ_GRAPH_WHEEL_Q_SYNC_TOL_FINE
            : 0.051;
        if (!Number.isFinite(qFloat) || Math.abs(qFloat - qDisplay) > qSyncTol) {
            eqGraphWheelQFloat[i] = qDisplay;
            qFloat = qDisplay;
        }
        let qFloatBeforeWheel = qFloat;
        let dy = e.deltaY;
        if (e.deltaMode === 1) {
            dy *= 16;
        } else if (e.deltaMode === 2) {
            dy *= 100;
        }
        let dir = dy > 0 ? 1 : dy < 0 ? -1 : 0;
        if (!dir) {
            return;
        }
        let mag = Math.abs(dy);
        let notchEq = Math.pow(mag, 0.58) / Math.pow(EQ_GRAPH_WHEEL_SENS_REF_PX, 0.58);
        let steps = Math.max(1, Math.min(EQ_GRAPH_WHEEL_MAX_STEPS, Math.round(notchEq)));
        let sens = eqGraphWheelQSensitivity(qFloat);
        let qStep = qFloat <= EQ_GRAPH_WHEEL_Q_FINE_MAX
            ? EQ_GRAPH_WHEEL_Q_STEP_FINE
            : EQ_GRAPH_WHEEL_Q_STEP;
        let dq = dir * qStep * steps * sens;
        let [qLo, qHi] = getEqConstraintQLoHi();
        /* Scroll up → lower Q, scroll down → higher Q (invert raw deltaY convention). */
        qFloat = Math.min(qHi, Math.max(qLo, qFloat - dq));
        eqGraphWheelQFloat[i] = qFloat;
        let q;
        if (qFloat <= EQ_GRAPH_WHEEL_Q_FINE_MAX) {
            q = Math.round(qFloat * 100) / 100;
        } else {
            q = Math.round(qFloat * 10) / 10;
            /* 0.31…0.34 rounds to one decimal as 0.3 — same as fine cap, so display/input never
               advances and tight fine-band resync fights the float (feels “stuck”). Leaving the
               fine band upward: jump to the next tenth (0.4). */
            if (q <= EQ_GRAPH_WHEEL_Q_FINE_MAX && qFloat > EQ_GRAPH_WHEEL_Q_FINE_MAX
                    && qFloatBeforeWheel <= EQ_GRAPH_WHEEL_Q_FINE_MAX) {
                q = Math.min(qHi, EQ_GRAPH_WHEEL_Q_FINE_MAX + EQ_GRAPH_WHEEL_Q_STEP);
                eqGraphWheelQFloat[i] = q;
            }
        }
        q = Math.max(qLo, Math.min(qHi, q));
        filterQInput[i].value = q <= EQ_GRAPH_WHEEL_Q_FINE_MAX
            ? q.toFixed(2)
            : String(q);
        cancelDeferredApplyEQ();
        applyEQExec();
        scheduleLiveEqSync();
        eqHistoryNotifyChange();
        setEqFilterSelectedRow(i);
        requestAnimationFrame(() => {
            let qEl = filterQInput[i];
            if (qEl) {
                qEl.focus();
                qEl.select();
            }
        });
    }
    function eqGraphPlotContextMenu(e) {
        if (interactInspect || eqGraphPointerState) {
            return;
        }
        let tab = document.querySelector("div.select");
        if (!extraEnabled || !extraEQEnabled || !tab
                || tab.getAttribute("data-selected") !== "extra") {
            return;
        }
        let m = clientToGraphPlotXY(e.clientX, e.clientY);
        if (!m) {
            return;
        }
        let hit = findEqGraphMarkerHit(m);
        if (!hit) {
            return;
        }
        e.preventDefault();
        let sel = filterTypeSelect[hit.rowIndex];
        if (sel) {
            let cur = (sel.value || "").trim();
            sel.value = eqGraphTypeCycleOrder[cur] || "PK";
        }
        cancelDeferredApplyEQ();
        applyEQExec();
        scheduleLiveEqSync();
        setEqFilterSelectedRow(hit.rowIndex);
        syncEqHoverPreview(m);
    }
    if (graphPlotHitRect && graphPlotHitRect.node()) {
        graphPlotHitRect.node().addEventListener("pointerdown", eqGraphPointerDown, {
            passive: false,
        });
        graphPlotHitRect.node().addEventListener("wheel", eqGraphPlotWheel, { passive: false });
        graphPlotHitRect.node().addEventListener("contextmenu", eqGraphPlotContextMenu, {
            passive: false,
        });
    }
    let clientPointOverGraphPlot = (clientX, clientY) => {
        let plot = graphPlotHitRect && graphPlotHitRect.node();
        if (!plot) {
            return false;
        }
        let r = plot.getBoundingClientRect();
        return clientX >= r.left && clientX <= r.right
            && clientY >= r.top && clientY <= r.bottom;
    };
    document.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) {
            return;
        }
        if (eqFilterSelectedRow === null) {
            return;
        }
        let tab = document.querySelector("div.select");
        if (!extraEnabled || !extraEQEnabled || !tab
                || tab.getAttribute("data-selected") !== "extra") {
            return;
        }
        let t = e.target;
        if (filtersContainer && filtersContainer.contains(t)) {
            return;
        }
        if (clientPointOverGraphPlot(e.clientX, e.clientY)) {
            let m = clientToGraphPlotXY(e.clientX, e.clientY);
            if (m && findEqGraphMarkerHit(m)) {
                return;
            }
        }
        setEqFilterSelectedRow(null);
    }, true);
    toneGeneratorAddFilterButton.addEventListener("click", () => {
        let hz = parseInt(toneGeneratorText.innerText, 10) || 0;
        addPeakingFilterFromHz(hz, EQ_GRAPH_BASE_GAIN);
    });
    pinkNoisePlayButton.addEventListener("click", () => {
        if (pinkNoisePlaying) {
            stopPinkNoisePlayback();
            return;
        }
        if (!window.AudioContext && !window.webkitAudioContext) {
            alert("Web audio api is disabled, please enable it if you want to use pink noise.");
            return;
        }
        if (toneGeneratorOsc) {
            fadeStopToneGeneratorPlayback();
        }
        pauseMusicForLiveSoundSwitch();
        pinkNoiseContext = pinkNoiseContext || new (window.AudioContext || window.webkitAudioContext)();
        pinkNoiseProcessor = createPinkNoiseProcessor(pinkNoiseContext);
        pinkNoiseMasterGain = pinkNoiseContext.createGain();
        pinkNoiseMasterGain.gain.value = livePinkNoisePlaybackGain;
        // rebuildPinkNoiseEqChain requires pinkNoisePlaying — set before first build
        pinkNoisePlaying = true;
        rebuildPinkNoiseEqChain();
        pinkNoiseAnalyser = pinkNoiseAnalyser || pinkNoiseContext.createAnalyser();
        configureLiveSpectrumAnalyser(pinkNoiseAnalyser);
        pinkNoiseMasterGain.disconnect();
        pinkNoiseMasterGain.connect(pinkNoiseAnalyser);
        pinkNoiseAnalyser.connect(pinkNoiseContext.destination);
        pinkNoisePlayButton.classList.add("playback-active");
        lastEqPlaybackSource = "pink";
        if (pinkNoiseContext.state !== "running") {
            void pinkNoiseContext.resume();
        }
        musicSpectrumViz.syncSpectrumViz();
        updateEqTraceOpacity();
    });
    // Tone Generator
    toneGeneratorFromInput.addEventListener("input", scheduleLiveEqSync);
    toneGeneratorToInput.addEventListener("input", scheduleLiveEqSync);
    toneGeneratorFromInput.addEventListener("input", syncEqSoundRangeBrushFromLiveSoundInputs);
    toneGeneratorToInput.addEventListener("input", syncEqSoundRangeBrushFromLiveSoundInputs);
    toneGeneratorFromInput.addEventListener("change", syncEqSoundRangeBrushFromLiveSoundInputs);
    toneGeneratorToInput.addEventListener("change", syncEqSoundRangeBrushFromLiveSoundInputs);
    toneGeneratorSlider.addEventListener("input", () => {
        if (toneSweepRafId !== null) {
            cancelAnimationFrame(toneSweepRafId);
            toneSweepRafId = null;
        }
        toneSweepPointerHoldUp();
        let from = Math.min(Math.max(parseInt(toneGeneratorFromInput.value) || 0, 20), 20000);
        let to = Math.min(Math.max(parseInt(toneGeneratorToInput.value) || 0, from), 20000);
        let position = parseFloat(toneGeneratorSlider.value) || 0;
        let freq = Math.round(Math.exp( // Slider move in log scale
            Math.log(from) + (Math.log(to) - Math.log(from)) * position));
        toneGeneratorText.innerText = freq;
        if (toneGeneratorOsc) {
            let t = toneGeneratorContext.currentTime;
            toneGeneratorOsc.frequency.cancelScheduledValues(t);
            toneGeneratorOsc.frequency.setTargetAtTime(freq, t, 0.2); // Smoother transition but also delay
        }
    });
    /** Start tone oscillator if stopped; for use from trusted pointer/keyboard handlers (not synthetic .click()). */
    let startToneGeneratorOscillatorIfStopped = () => {
        if (toneGeneratorOsc) {
            return true;
        }
        clearToneGenFadeCleanupTimer();
        if (toneGeneratorMasterGain || toneGeneratorBiquads.length) {
            toneGeneratorGraphTeardown();
        }
        stopPinkNoisePlayback();
        pauseMusicForLiveSoundSwitch();
        if (!toneGeneratorContext) {
            if (!window.AudioContext && !window.webkitAudioContext) {
                alert("Web audio api is disabled, please enable it if you want to use tone generator.");
                return false;
            }
            toneGeneratorContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        let tA = toneGeneratorContext.currentTime;
        toneGeneratorOsc = toneGeneratorContext.createOscillator();
        toneGeneratorOsc.type = "sine";
        toneGeneratorOsc.frequency.value = parseInt(toneGeneratorText.innerText, 10) || TONE_GENERATOR_DEFAULT_HZ;
        toneGeneratorMasterGain = toneGeneratorContext.createGain();
        toneGeneratorMasterGain.gain.setValueAtTime(0, tA);
        rebuildToneGeneratorEqChain();
        toneGeneratorAnalyser = toneGeneratorAnalyser || toneGeneratorContext.createAnalyser();
        configureLiveSpectrumAnalyser(toneGeneratorAnalyser);
        toneGeneratorMasterGain.disconnect();
        toneGeneratorMasterGain.connect(toneGeneratorAnalyser);
        toneGeneratorAnalyser.connect(toneGeneratorContext.destination);
        toneGeneratorOsc.start(tA);
        toneGeneratorMasterGain.gain.linearRampToValueAtTime(liveToneGeneratorPlaybackGain, tA + TONE_GEN_FADE_IN_SEC);
        toneGeneratorPlayButton.classList.add("playback-active");
        lastEqPlaybackSource = "tone";
        if (toneGeneratorContext.state !== "running") {
            void toneGeneratorContext.resume();
        }
        musicSpectrumViz.syncSpectrumViz();
        updateEqTraceOpacity();
        return true;
    };
    let startToneGeneratorSweep = () => {
        let fromHz = Math.min(Math.max(parseInt(toneGeneratorFromInput.value) || 0, 20), 20000);
        let toHz = Math.min(Math.max(parseInt(toneGeneratorToInput.value) || 0, fromHz), 20000);
        if (fromHz > toHz) {
            let swap = fromHz;
            fromHz = toHz;
            toHz = swap;
        }
        if (!toneGeneratorOsc) {
            toneGeneratorSlider.value = "0";
            toneGeneratorText.innerText = String(fromHz);
            if (!startToneGeneratorOscillatorIfStopped()) {
                return;
            }
        }
        if (toneSweepRafId !== null) {
            cancelAnimationFrame(toneSweepRafId);
            toneSweepRafId = null;
        }
        let sweepDurationSec = 0;
        if (fromHz !== toHz && TONE_SWEEP_FULL_LOG_SPAN > 1e-9) {
            let logSpan = Math.log(toHz / fromHz);
            if (logSpan > 1e-9) {
                sweepDurationSec = Math.max(TONE_SWEEP_MIN_DURATION_SEC,
                    toneSweepDurationSec * (logSpan / TONE_SWEEP_FULL_LOG_SPAN));
            } else {
                sweepDurationSec = TONE_SWEEP_MIN_DURATION_SEC;
            }
        }
        void toneGeneratorContext.resume();
        let t0 = toneGeneratorContext.currentTime;
        toneGeneratorOsc.frequency.cancelScheduledValues(t0);
        let curF = toneGeneratorOsc.frequency.value;
        let leadInSec = 0;
        if (fromHz !== toHz) {
            let cross = TONE_GEN_FADE_IN_SEC;
            if (Math.abs(curF - fromHz) > 0.5) {
                leadInSec = cross;
                toneGeneratorOsc.frequency.setValueAtTime(Math.max(20, curF), t0);
                toneGeneratorOsc.frequency.exponentialRampToValueAtTime(fromHz, t0 + cross);
                t0 += cross;
            } else {
                toneGeneratorOsc.frequency.setValueAtTime(fromHz, t0);
            }
            toneGeneratorOsc.frequency.exponentialRampToValueAtTime(toHz, t0 + sweepDurationSec);
        } else {
            toneGeneratorOsc.frequency.setValueAtTime(fromHz, t0);
        }
        /** Wall-clock span between loops: fade out (same as tone stop) + fade in (same as tone start), silent in between. */
        const loopGapWallMs = (TONE_GEN_FADE_OUT_SEC + TONE_GEN_FADE_IN_SEC) * 1000;
        let loopNextSweepPerfAnchorMs = null;
        let scheduleLoopSilenceThenNextSweep = () => {
            if (!toneGeneratorOsc || !toneGeneratorContext || !toneGeneratorMasterGain) {
                return;
            }
            let t = toneGeneratorContext.currentTime;
            let outSec = TONE_GEN_FADE_OUT_SEC;
            let inSec = TONE_GEN_FADE_IN_SEC;
            let tSilent = t + outSec;
            let tSweepStart = tSilent + inSec;
            let g = toneGeneratorMasterGain.gain;
            g.cancelScheduledValues(t);
            g.setValueAtTime(g.value, t);
            g.linearRampToValueAtTime(0, tSilent);
            g.setValueAtTime(0, tSilent);
            g.linearRampToValueAtTime(liveToneGeneratorPlaybackGain, tSweepStart);
            let f = toneGeneratorOsc.frequency;
            f.cancelScheduledValues(tSilent);
            f.setValueAtTime(fromHz, tSilent);
            f.setValueAtTime(fromHz, tSweepStart);
            f.exponentialRampToValueAtTime(toHz, tSweepStart + sweepDurationSec);
            /* Approximate wall time when the next frequency ramp begins (audio clock ≈ real time). */
            loopNextSweepPerfAnchorMs = performance.now() + (tSweepStart - t) * 1000;
        };
        let sweepStartMs = performance.now();
        let sweepDurationMs = (sweepDurationSec + leadInSec) * 1000;
        let sweepPhase = "sweep";
        let sweepTick = () => {
            if (sweepPhase === "gap") {
                let uGap = Math.min(1, (performance.now() - sweepStartMs) / sweepDurationMs);
                toneGeneratorSlider.value = "0";
                toneGeneratorText.innerText = String(fromHz);
                if (uGap < 1) {
                    toneSweepRafId = requestAnimationFrame(sweepTick);
                    return;
                }
                sweepPhase = "sweep";
                sweepStartMs = loopNextSweepPerfAnchorMs != null
                    ? loopNextSweepPerfAnchorMs
                    : performance.now();
                loopNextSweepPerfAnchorMs = null;
                sweepDurationMs = sweepDurationSec * 1000;
                toneSweepRafId = requestAnimationFrame(sweepTick);
                return;
            }
            let u = Math.min(1, (performance.now() - sweepStartMs) / sweepDurationMs);
            let freq = Math.round(Math.exp(
                Math.log(fromHz) + (Math.log(toHz) - Math.log(fromHz)) * u));
            toneGeneratorSlider.value = String(u);
            toneGeneratorText.innerText = String(freq);
            if (u < 1) {
                toneSweepRafId = requestAnimationFrame(sweepTick);
            } else {
                let loopHeld = toneSweepLoopSpaceHeld || toneSweepLoopPointerHeld;
                if (loopHeld && fromHz !== toHz && toneGeneratorOsc && sweepDurationSec > 0) {
                    scheduleLoopSilenceThenNextSweep();
                    sweepPhase = "gap";
                    sweepStartMs = performance.now();
                    sweepDurationMs = loopGapWallMs;
                    toneGeneratorSlider.value = "0";
                    toneGeneratorText.innerText = String(fromHz);
                    toneSweepRafId = requestAnimationFrame(sweepTick);
                    return;
                }
                toneSweepRafId = null;
                toneGeneratorSlider.value = "0";
                toneGeneratorText.innerText = String(fromHz);
                if (toneGeneratorOsc) {
                    toneGeneratorPlayButton.click();
                }
            }
        };
        toneSweepRafId = requestAnimationFrame(sweepTick);
    };
    document.addEventListener("keydown", (e) => {
        if (e.code !== "Space" || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
            return;
        }
        let t = e.target;
        /* Capture: cancel Space default early on number inputs (incl. key repeat) so values are not cleared; still set loop below on first press. */
        if (t && t.nodeType === 1 && t.tagName === "INPUT" && t.getAttribute("type") === "number") {
            if ((t.closest && t.closest("div.extra-eq")) || (t.closest && t.closest("div.live-sound-tools"))) {
                e.preventDefault();
            }
        }
        if (e.repeat) {
            return;
        }
        let tab = document.querySelector("div.select");
        if (!extraEnabled || !tab || tab.getAttribute("data-selected") !== "extra") {
            return;
        }
        toneSweepLoopSpaceHeld = true;
    }, true);
    document.addEventListener("keyup", (e) => {
        if (e.code !== "Space") {
            return;
        }
        toneSweepLoopSpaceHeld = false;
    }, true);
    /* Second mousedown of a double-click: UIEvent.detail === 2. Defer loop sweep by TONE_PLAY_BTN_HOLD_MS so a
       normal double-click (release before then) still starts sweep on mouseup via click(detail=2). */
    toneGeneratorPlayButton.addEventListener("mousedown", (e) => {
        if (e.button !== 0 || e.detail !== 2) {
            return;
        }
        if (performance.now() - tonePlayBtnTouchArmTs < 40) {
            return;
        }
        tonePlayBtnArmLoopHoldAfterSecondPress(null);
    });
    toneGeneratorPlayButton.addEventListener("pointerdown", (e) => {
        if (e.button !== 0 || e.pointerType !== "touch") {
            return;
        }
        let now = performance.now();
        let isQuickSecondDown = tonePlayBtnTouchPrevDownTs > 0
            && (now - tonePlayBtnTouchPrevDownTs) <= TONE_PLAY_BTN_TOUCH_DOUBLE_MS;
        tonePlayBtnTouchPrevDownTs = now;
        if (!isQuickSecondDown) {
            return;
        }
        tonePlayBtnTouchPrevDownTs = 0;
        tonePlayBtnTouchArmTs = now;
        tonePlayBtnArmLoopHoldAfterSecondPress(() => {
            if (toneSweepRafId !== null) {
                return;
            }
            startToneGeneratorSweep();
        });
    });
    toneGeneratorPlayButton.addEventListener("click", (e) => {
        if (e.detail === 2) {
            e.preventDefault();
            if (toneSweepRafId === null) {
                startToneGeneratorSweep();
            }
            return;
        }
        if (toneGeneratorOsc) {
            fadeStopToneGeneratorPlayback();
        } else {
            if (!startToneGeneratorOscillatorIfStopped()) {
                return;
            }
        }
    });
    let removeMusicTrack = () => {
        musicRestoreCancelToken++;
        void clearPersistedMusic();
        if (musicAudio) {
            musicAudio.removeEventListener("timeupdate", musicAudioTimeUpdateHandler);
            musicAudio.removeEventListener("ended", musicAudioEndedHandler);
            musicAudio.pause();
            musicAudio.removeAttribute("src");
            try {
                musicAudio.load();
            } catch (err) { /* noop */ }
        }
        if (musicObjectUrl) {
            URL.revokeObjectURL(musicObjectUrl);
            musicObjectUrl = null;
        }
        musicFileLoaded = false;
        musicSeekDragging = false;
        musicTrimDragging = null;
        musicSpectrumViz.stop();
        if (musicTrimIdleTimer !== null) {
            clearTimeout(musicTrimIdleTimer);
            musicTrimIdleTimer = null;
        }
        musicSegStartU = 0;
        musicSegEndU = 1;
        if (musicPlayButton) {
            musicPlayButton.disabled = true;
            musicPlayButton.classList.remove("playback-active");
        }
        if (musicSegmentSliderEl) {
            musicSegmentSliderEl.classList.add("music-segment-slider-disabled");
        }
        syncMusicSegmentVisuals();
        if (musicPlaybackPanel) {
            musicPlaybackPanel.setAttribute("aria-hidden", "true");
        }
        if (musicCard) {
            musicCard.classList.remove("music-file-loaded");
        }
        if (musicAddRemoveButton) {
            musicAddRemoveButton.textContent = "+ Add Music";
        }
        if (musicFileInput) {
            musicFileInput.value = "";
        }
        disconnectEqBiquads(musicBiquads);
        disconnectEqBiquads(musicBiquadsLeft);
        disconnectEqBiquads(musicBiquadsRight);
        disconnectMusicBandFilters();
        if (musicMediaSourceNode) {
            try {
                musicMediaSourceNode.disconnect();
            } catch (err) { /* noop */ }
            musicMediaSourceNode = null;
        }
        if (musicMasterGain) {
            try {
                musicMasterGain.disconnect();
            } catch (err) { /* noop */ }
            musicMasterGain = null;
        }
        if (musicAnalyser) {
            try {
                musicAnalyser.disconnect();
            } catch (err) { /* noop */ }
            musicAnalyser = null;
        }
        if (musicContext && musicContext.state !== "closed") {
            void musicContext.close();
        }
        musicContext = null;
        musicAudio = null;
        if (lastEqPlaybackSource === "music") {
            lastEqPlaybackSource = "pink";
        }
        musicSpectrumViz.syncSpectrumViz();
    };
    let initMusicAudioGraph = () => {
        if (musicContext) {
            return true;
        }
        if (!window.AudioContext && !window.webkitAudioContext) {
            return false;
        }
        musicContext = new (window.AudioContext || window.webkitAudioContext)();
        musicAudio = new Audio();
        musicAudio.loop = false;
        musicAudio.preload = "auto";
        musicAudio.addEventListener("timeupdate", musicAudioTimeUpdateHandler);
        musicAudio.addEventListener("ended", musicAudioEndedHandler);
        musicAudio.addEventListener("error", () => {
            alert("Could not load or play this audio file.");
            removeMusicTrack();
        });
        musicMediaSourceNode = musicContext.createMediaElementSource(musicAudio);
        musicMasterGain = musicContext.createGain();
        musicMasterGain.gain.value = liveMusicPlaybackGain;
        rebuildMusicEqChain();
        musicAnalyser = musicContext.createAnalyser();
        configureLiveSpectrumAnalyser(musicAnalyser);
        musicMasterGain.connect(musicAnalyser);
        musicAnalyser.connect(musicContext.destination);
        musicSpectrumViz.syncSpectrumViz();
        return true;
    };
    let stopPinkAndToneForExclusiveMusic = () => {
        stopPinkNoisePlayback();
        if (toneGeneratorOsc) {
            fadeStopToneGeneratorPlayback();
        }
    };
    musicSpectrumViz.isActive = function () {
        let v = musicSpectrumViz;
        if (v.analyser === musicAnalyser && musicContext) {
            return musicFileLoaded && musicAudio && !musicAudio.paused;
        }
        if (v.analyser === pinkNoiseAnalyser) {
            return !!pinkNoisePlaying;
        }
        if (v.analyser === toneGeneratorAnalyser) {
            return !!toneGeneratorOsc;
        }
        return false;
    };
    musicSpectrumViz.syncSpectrumViz = function () {
        musicSpectrumViz.stop();
        if (musicFileLoaded && musicAudio && !musicAudio.paused && musicContext && musicAnalyser) {
            musicSpectrumViz.analyser = musicAnalyser;
            musicSpectrumViz.context = musicContext;
            musicSpectrumViz.ensureBuffer();
            musicSpectrumViz.start();
            return;
        }
        if (pinkNoisePlaying && pinkNoiseContext && pinkNoiseAnalyser) {
            musicSpectrumViz.analyser = pinkNoiseAnalyser;
            musicSpectrumViz.context = pinkNoiseContext;
            musicSpectrumViz.ensureBuffer();
            musicSpectrumViz.start();
            return;
        }
        if (toneGeneratorOsc && toneGeneratorContext && toneGeneratorAnalyser) {
            musicSpectrumViz.analyser = toneGeneratorAnalyser;
            musicSpectrumViz.context = toneGeneratorContext;
            musicSpectrumViz.ensureBuffer();
            musicSpectrumViz.start();
            return;
        }
        musicSpectrumViz.analyser = null;
        musicSpectrumViz.context = null;
    };
    let startMusicPlayback = () => {
        if (!musicFileLoaded || !musicAudio || !musicContext || !musicPlayButton) {
            return Promise.reject(new Error("music not ready"));
        }
        let d = getMusicDuration();
        if (d > 0) {
            let t0 = musicSegStartU * d;
            let t1 = musicSegEndU * d;
            let ct = musicAudio.currentTime;
            if (ct < t0 || ct >= t1 - 0.02) {
                musicAudio.currentTime = t0;
            }
        }
        stopPinkAndToneForExclusiveMusic();
        void musicContext.resume();
        return musicAudio.play().then(() => {
            musicPlayButton.classList.add("playback-active");
            lastEqPlaybackSource = "music";
            musicSpectrumViz.syncSpectrumViz();
            updateEqTraceOpacity();
        });
    };
    let wireMusicLoadedFromBlob = (blob, segOpt, loadOpts) => {
        loadOpts = loadOpts || {};
        let autoPlayAfterLoad = loadOpts.autoPlay === true;
        if (!musicAudio || !musicPlayButton || !musicCard || !musicSegmentSliderEl || !musicAddRemoveButton) {
            return;
        }
        if (musicObjectUrl) {
            URL.revokeObjectURL(musicObjectUrl);
        }
        musicAudio.pause();
        musicSpectrumViz.stop();
        musicPlayButton.classList.remove("playback-active");
        musicObjectUrl = URL.createObjectURL(blob);
        if (segOpt && typeof segOpt.segStartU === "number" && typeof segOpt.segEndU === "number") {
            musicSegStartU = segOpt.segStartU;
            musicSegEndU = segOpt.segEndU;
        } else {
            musicSegStartU = 0;
            musicSegEndU = 1;
        }
        musicAudio.src = musicObjectUrl;
        musicAudio.load();
        musicFileLoaded = true;
        musicCard.classList.add("music-file-loaded");
        if (musicPlaybackPanel) {
            musicPlaybackPanel.setAttribute("aria-hidden", "false");
        }
        musicPlayButton.disabled = false;
        musicSegmentSliderEl.classList.remove("music-segment-slider-disabled");
        let onMusicMeta = () => {
            clampMusicSegmentBounds();
            syncMusicSegmentVisuals();
            persistMusicSegmentToLocalStorage();
        };
        musicAudio.addEventListener("loadedmetadata", onMusicMeta, { once: true });
        syncMusicSegmentVisuals();
        musicAddRemoveButton.textContent = "- Remove Music";
        rebuildMusicEqChain();
        if (autoPlayAfterLoad) {
            let autoPlayWhenReady = () => {
                startMusicPlayback().catch(() => {
                    /* autoplay may be blocked without further gesture; user can press play */
                });
            };
            if (musicAudio.readyState >= 2) {
                autoPlayWhenReady();
            } else {
                musicAudio.addEventListener("canplay", autoPlayWhenReady, { once: true });
            }
        }
    };
    if (musicPlayButton && musicSegmentSliderEl && musicSegmentTrackEl && musicSegmentSeekEl
        && musicSegmentHandleStart && musicSegmentHandleEnd && musicAddRemoveButton && musicFileInput && musicCard) {
        musicAddRemoveButton.addEventListener("click", () => {
            if (!musicFileLoaded) {
                musicFileInput.click();
            } else {
                removeMusicTrack();
            }
        });
        musicFileInput.addEventListener("change", () => {
            let file = musicFileInput.files && musicFileInput.files[0];
            if (!file) {
                return;
            }
            if (!window.AudioContext && !window.webkitAudioContext) {
                alert("Web audio API is disabled; music playback is unavailable.");
                musicFileInput.value = "";
                return;
            }
            musicRestoreCancelToken++;
            if (!initMusicAudioGraph()) {
                musicFileInput.value = "";
                return;
            }
            wireMusicLoadedFromBlob(file, null, { autoPlay: true });
            persistMusicFileToIndexedDb(file);
            musicFileInput.value = "";
            setTimeout(() => {
                musicAddRemoveButton.blur();
                musicFileInput.blur();
            }, 0);
        });
        musicPlayButton.addEventListener("click", () => {
            if (!musicFileLoaded || !musicAudio || !musicContext) {
                return;
            }
            if (musicAudio.paused) {
                startMusicPlayback().catch(() => {
                    alert("Playback could not be started.");
                });
            } else {
                musicAudio.pause();
                musicPlayButton.classList.remove("playback-active");
                musicSpectrumViz.syncSpectrumViz();
                updateEqTraceOpacity();
            }
        });
        let finishTrimStart = () => {
            let d = getMusicDuration();
            if (d > 0 && musicAudio) {
                musicAudio.currentTime = musicSegStartU * d;
            }
            startMusicPlayback().catch(() => {
                /* autoplay or resume may fail */
            });
        };
        let finishTrimEnd = () => {
            let d = getMusicDuration();
            if (d > 0 && musicAudio) {
                let t0 = musicSegStartU * d;
                let t1 = musicSegEndU * d;
                musicAudio.currentTime = Math.max(t0, t1 - 0.5);
            }
            startMusicPlayback().catch(() => {
                /* autoplay or resume may fail */
            });
        };
        let musicTrimIdleApplyMs = 100;
        let clearMusicTrimIdleTimer = () => {
            if (musicTrimIdleTimer !== null) {
                clearTimeout(musicTrimIdleTimer);
                musicTrimIdleTimer = null;
            }
        };
        let scheduleMusicTrimIdleApply = (which) => {
            clearMusicTrimIdleTimer();
            musicTrimIdleTimer = setTimeout(() => {
                musicTrimIdleTimer = null;
                if (musicTrimDragging !== which) {
                    return;
                }
                if (which === "start") {
                    finishTrimStart();
                } else {
                    finishTrimEnd();
                }
                persistMusicSegmentToLocalStorage();
            }, musicTrimIdleApplyMs);
        };
        let bindTrimHandle = (handleEl, which) => {
            handleEl.addEventListener("pointerdown", (e) => {
                if (!musicFileLoaded || e.button !== 0) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                musicTrimDragging = which;
                handleEl.setPointerCapture(e.pointerId);
                scheduleMusicTrimIdleApply(which);
            });
            handleEl.addEventListener("pointermove", (e) => {
                if (musicTrimDragging !== which) {
                    return;
                }
                let u = pointerToMusicHandleU(e.clientX);
                if (which === "start") {
                    musicSegStartU = Math.min(u, musicSegEndU - musicSegMinGapU());
                } else {
                    musicSegEndU = Math.max(u, musicSegStartU + musicSegMinGapU());
                }
                clampMusicSegmentBounds();
                syncMusicSegmentVisuals();
                scheduleMusicTrimIdleApply(which);
            });
            let endDrag = (e, applyRelease) => {
                if (musicTrimDragging !== which) {
                    return;
                }
                clearMusicTrimIdleTimer();
                musicTrimDragging = null;
                try {
                    handleEl.releasePointerCapture(e.pointerId);
                } catch (err) { /* noop */ }
                if (applyRelease) {
                    if (which === "start") {
                        finishTrimStart();
                    } else {
                        finishTrimEnd();
                    }
                    persistMusicSegmentToLocalStorage();
                }
            };
            handleEl.addEventListener("pointerup", (e) => {
                endDrag(e, true);
            });
            handleEl.addEventListener("pointercancel", (e) => {
                endDrag(e, false);
            });
        };
        bindTrimHandle(musicSegmentHandleStart, "start");
        bindTrimHandle(musicSegmentHandleEnd, "end");
        musicSegmentSeekEl.addEventListener("pointerdown", (e) => {
            if (!musicFileLoaded || e.button !== 0) {
                return;
            }
            musicSeekDragging = true;
            musicSegmentSeekEl.setPointerCapture(e.pointerId);
            seekMusicToClientX(e.clientX);
        });
        musicSegmentSeekEl.addEventListener("pointermove", (e) => {
            if (!musicSeekDragging) {
                return;
            }
            seekMusicToClientX(e.clientX);
        });
        let endSeekDrag = (e) => {
            if (!musicSeekDragging) {
                return;
            }
            musicSeekDragging = false;
            try {
                musicSegmentSeekEl.releasePointerCapture(e.pointerId);
            } catch (err) { /* noop */ }
            syncMusicSegmentVisuals();
            persistMusicSegmentToLocalStorage();
        };
        musicSegmentSeekEl.addEventListener("pointerup", endSeekDrag);
        musicSegmentSeekEl.addEventListener("pointercancel", endSeekDrag);
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden" && musicFileLoaded) {
                persistMusicSegmentToLocalStorage();
            }
        });
        let tryRestorePersistedMusic = () => {
            if (!window.indexedDB || musicFileLoaded) {
                return;
            }
            let tRestore = musicRestoreCancelToken;
            idbGetCringraphMusicRecord().then((rec) => {
                if (tRestore !== musicRestoreCancelToken || musicFileLoaded || !rec || !rec.blob) {
                    return;
                }
                let blobBytes = typeof rec.blob.size === "number" ? rec.blob.size
                    : (typeof rec.size === "number" ? rec.size : 0);
                if (blobBytes > CRINGRAPH_MUSIC_MAX_PERSIST_BYTES) {
                    void clearPersistedMusic();
                    return;
                }
                if (!window.AudioContext && !window.webkitAudioContext) {
                    return;
                }
                if (!initMusicAudioGraph()) {
                    return;
                }
                let seg = loadMusicSegmentFromLocalStorage();
                wireMusicLoadedFromBlob(rec.blob, seg);
            }).catch(() => {
                /* private mode / quota / unsupported */
            });
        };
        tryRestorePersistedMusic();
    }
    let syncToneGeneratorToEqFrequencyHz = (hz) => {
        /* EQ freq edits normally retune the tone preview; skip while a sweep is running so the ramp is not cancelled. */
        if (toneSweepRafId !== null) {
            return;
        }
        let [fLo, fHi] = getEqConstraintFreqLoHi();
        hz = Math.min(fHi, Math.max(fLo, Math.round(Number(hz)) || fLo));
        let from = Math.min(Math.max(parseInt(toneGeneratorFromInput.value) || 0, 20), 20000);
        let to = Math.min(Math.max(parseInt(toneGeneratorToInput.value) || 0, from), 20000);
        let logSpan = Math.log(to) - Math.log(from);
        let position = logSpan > 0
            ? (Math.log(hz) - Math.log(from)) / logSpan
            : 0;
        position = Math.min(1, Math.max(0, position));
        toneGeneratorSlider.value = String(position);
        toneGeneratorText.innerText = String(hz);
        if (toneGeneratorOsc && toneGeneratorContext) {
            let t = toneGeneratorContext.currentTime;
            toneGeneratorOsc.frequency.cancelScheduledValues(t);
            toneGeneratorOsc.frequency.setTargetAtTime(hz, t, 0.2);
        }
    };
    const EQ_SOUND_BRUSH_DISMISS_PAD_PX = 10;
    const EQ_SOUND_BRUSH_DISMISS_ICON_PX = 16;
    const EQ_SOUND_BRUSH_DISMISS_BOX_PX = 2 * EQ_SOUND_BRUSH_DISMISS_PAD_PX + EQ_SOUND_BRUSH_DISMISS_ICON_PX;
    let eqSoundRangeBrushDismissOverlay = null;
    /** @type {{ xRight: number, yTop: number }|null} */
    let eqSoundRangeBrushDismissLast = null;
    let eqSoundRangeBrushDismissListeners = false;
    let hideEqSoundRangeBrushDismissOverlay = () => {
        eqSoundRangeBrushDismissLast = null;
        if (eqSoundRangeBrushDismissOverlay) {
            eqSoundRangeBrushDismissOverlay.style.display = "none";
        }
    };
    let syncEqSoundRangeBrushDismissOverlay = () => {
        let o = eqSoundRangeBrushDismissOverlay;
        let last = eqSoundRangeBrushDismissLast;
        if (!o || !last) {
            return;
        }
        let pBr = graphPlotXYToClient(last.xRight, last.yTop);
        if (!pBr) {
            o.style.display = "none";
            return;
        }
        let box = EQ_SOUND_BRUSH_DISMISS_BOX_PX;
        o.style.display = "block";
        o.style.left = Math.round(pBr[0] - box) + "px";
        o.style.top = Math.round(pBr[1]) + "px";
        o.style.width = box + "px";
        o.style.height = box + "px";
    };
    let ensureEqSoundRangeBrushDismissOverlay = () => {
        if (eqSoundRangeBrushDismissOverlay) {
            return;
        }
        let o = document.createElement("div");
        o.className = "eq-sound-range-brush-dismiss-overlay";
        o.style.display = "none";
        let btn = document.createElement("button");
        btn.type = "button";
        btn.className = "eq-sound-range-brush-dismiss";
        btn.title = "Clear band highlight (full 20 Hz – 20 kHz range)";
        btn.setAttribute("aria-label", "Clear sound tools band highlight on graph");
        let icon = document.createElement("span");
        icon.className = "eq-sound-range-brush-dismiss-icon";
        icon.setAttribute("aria-hidden", "true");
        btn.appendChild(icon);
        btn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            resetLiveSoundFrequencyRangeToFullBand(ev);
        });
        o.appendChild(btn);
        document.body.appendChild(o);
        eqSoundRangeBrushDismissOverlay = o;
        if (!eqSoundRangeBrushDismissListeners) {
            eqSoundRangeBrushDismissListeners = true;
            window.addEventListener("resize", syncEqSoundRangeBrushDismissOverlay, true);
            window.addEventListener("scroll", syncEqSoundRangeBrushDismissOverlay, true);
        }
    };
    function clearEqSoundRangeBrush() {
        hideEqSoundRangeBrushDismissOverlay();
        gEqSoundRangeBrush.selectAll("*").remove();
    }
    function resetLiveSoundFrequencyRangeToFullBand(ev) {
        if (ev && ev.stopPropagation) {
            ev.stopPropagation();
        }
        if (ev && ev.preventDefault) {
            ev.preventDefault();
        }
        if (!toneGeneratorFromInput || !toneGeneratorToInput) {
            return;
        }
        toneGeneratorFromInput.value = "20";
        toneGeneratorToInput.value = "20000";
        let midHz = Math.round(Math.exp((Math.log(20) + Math.log(20000)) / 2));
        syncToneGeneratorToEqFrequencyHz(midHz);
        scheduleLiveEqSync();
        clearEqSoundRangeBrush();
    }
    let liveSoundRangeResetBtn = document.getElementById("live-sound-range-reset-btn");
    if (liveSoundRangeResetBtn) {
        liveSoundRangeResetBtn.addEventListener("click", resetLiveSoundFrequencyRangeToFullBand);
    }
    document.addEventListener("keydown", (e) => {
        if (e.code !== "Escape") {
            return;
        }
        let tab = document.querySelector("div.select");
        if (!extraEnabled || !tab || tab.getAttribute("data-selected") !== "extra") {
            return;
        }
        if (e.target !== toneGeneratorFromInput && e.target !== toneGeneratorToInput) {
            return;
        }
        e.preventDefault();
        resetLiveSoundFrequencyRangeToFullBand(e);
        if (typeof e.target.blur === "function") {
            e.target.blur();
        }
    });
    function renderEqSoundRangeBrush(hz1, hz2) {
        gEqSoundRangeBrush.selectAll("*").remove();
        hideEqSoundRangeBrushDismissOverlay();
        if (hz1 === null || hz1 === undefined || hz2 === null || hz2 === undefined) {
            return;
        }
        if (!Number.isFinite(hz1) || !Number.isFinite(hz2)) {
            return;
        }
        let lo = Math.min(hz1, hz2);
        let hi = Math.max(hz1, hz2);
        let [fLo, fHi] = getEqConstraintFreqLoHi();
        lo = Math.min(fHi, Math.max(fLo, lo));
        hi = Math.min(fHi, Math.max(fLo, hi));
        if (hi <= lo) {
            return;
        }
        let xa = Math.min(x(lo), x(hi));
        let xb = Math.max(x(lo), x(hi));
        let w = Math.max(0.5, xb - xa);
        let inner = gEqSoundRangeBrush.append("g").attr("class", "eq-sound-range-brush-inner");
        inner.append("rect")
            .attr("class", "eq-sound-range-brush-rect")
            .attr("x", xa)
            .attr("y", 20)
            .attr("width", w)
            .attr("height", 302);
        ensureEqSoundRangeBrushDismissOverlay();
        eqSoundRangeBrushDismissLast = { xRight: xa + w, yTop: 20 };
        syncEqSoundRangeBrushDismissOverlay();
    }
    function syncEqSoundRangeBrushFromLiveSoundInputs() {
        let tab = document.querySelector("div.select");
        if (!extraEnabled || !extraEQEnabled || !tab
                || tab.getAttribute("data-selected") !== "extra") {
            clearEqSoundRangeBrush();
            return;
        }
        if (!toneGeneratorFromInput || !toneGeneratorToInput) {
            clearEqSoundRangeBrush();
            return;
        }
        let from = Math.min(Math.max(parseInt(toneGeneratorFromInput.value, 10) || 20, 20), 20000);
        let to = Math.min(Math.max(parseInt(toneGeneratorToInput.value, 10) || 20, 20), 20000);
        let lo = Math.min(from, to);
        let hi = Math.max(from, to);
        if (lo > 20 || hi < 20000) {
            renderEqSoundRangeBrush(lo, hi);
            gEqSoundRangeBrush.raise();
            gEqFilterMarkers.raise();
            gEqHoverPreview.raise();
        } else {
            clearEqSoundRangeBrush();
        }
    }
    function applyLiveSoundRangeFromHzPair(hz1, hz2) {
        if (!toneGeneratorFromInput || !toneGeneratorToInput) {
            return;
        }
        if (hz1 === null || hz1 === undefined || hz2 === null || hz2 === undefined) {
            return;
        }
        if (!Number.isFinite(hz1) || !Number.isFinite(hz2)) {
            return;
        }
        let lo = Math.round(Math.min(hz1, hz2));
        let hi = Math.round(Math.max(hz1, hz2));
        let [fLo, fHi] = getEqConstraintFreqLoHi();
        lo = Math.min(fHi, Math.max(fLo, lo));
        hi = Math.min(fHi, Math.max(fLo, hi));
        if (hi < lo) {
            let t = lo;
            lo = hi;
            hi = t;
        }
        if (hi <= lo) {
            hi = Math.min(fHi, lo + 1);
        }
        toneGeneratorFromInput.value = String(lo);
        toneGeneratorToInput.value = String(hi);
        let midHz = Math.round(Math.exp((Math.log(Math.max(lo, 20.001)) + Math.log(hi)) / 2));
        syncToneGeneratorToEqFrequencyHz(midHz);
        scheduleLiveEqSync();
    }
    eqSoundRangeUiHooks.syncBrushFromInputs = syncEqSoundRangeBrushFromLiveSoundInputs;
    filtersContainer.addEventListener("focusin", (e) => {
        let rowEl = e.target.closest && e.target.closest("div.filter");
        if (rowEl && filtersContainer.contains(rowEl)) {
            let rows = filtersContainer.querySelectorAll("div.filter");
            let ix = Array.prototype.indexOf.call(rows, rowEl);
            if (ix >= 0) {
                setEqFilterSelectedRow(ix);
            }
        }
        if (!(e.target.matches && e.target.matches("input[name='freq']"))) {
            return;
        }
        let hz = parseInt(e.target.value, 10);
        if (!Number.isFinite(hz)) {
            hz = 20;
        }
        syncToneGeneratorToEqFrequencyHz(hz);
    });
    let eqFreqToToneDebounceTimer = null;
    filtersContainer.addEventListener("input", (e) => {
        if (!(e.target.matches && e.target.matches("input[name='freq']"))) {
            return;
        }
        let inputEl = e.target;
        clearTimeout(eqFreqToToneDebounceTimer);
        eqFreqToToneDebounceTimer = setTimeout(() => {
            eqFreqToToneDebounceTimer = null;
            let hz = parseInt(inputEl.value, 10);
            if (!Number.isFinite(hz)) {
                hz = 20;
            }
            syncToneGeneratorToEqFrequencyHz(hz);
        }, 100);
    });
    let resumeAudioContextsFromUserGesture = () => {
        if (pinkNoiseContext && pinkNoiseContext.state !== "running") {
            void pinkNoiseContext.resume();
        }
        if (toneGeneratorContext && toneGeneratorContext.state !== "running") {
            void toneGeneratorContext.resume();
        }
        if (musicContext && musicContext.state !== "running") {
            void musicContext.resume();
        }
    };
    document.addEventListener("keydown", (e) => {
        if (e.repeat) {
            return;
        }
        /* ⌘/Ctrl+Backspace or Alt+Backspace: remove/clear selected EQ band (see deleteSelectedEqFilterRow). */
        if (e.code !== "Backspace") {
            return;
        }
        if (!e.metaKey && !e.altKey && !e.ctrlKey) {
            return;
        }
        let tab = document.querySelector("div.select");
        if (!extraEnabled || !extraEQEnabled || !tab
                || tab.getAttribute("data-selected") !== "extra") {
            return;
        }
        let rowIx = resolveEqFilterRowIndexForShortcut();
        if (rowIx === null) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        deleteSelectedEqFilterRow(rowIx);
    }, true);
    document.addEventListener("keydown", (e) => {
        if (e.code !== "Space" && e.key !== " ") {
            return;
        }
        let t = e.target;
        if (t && t.nodeType === 1 && t.tagName === "INPUT" && t.getAttribute("type") === "number") {
            if ((t.closest && t.closest("div.extra-eq")) || (t.closest && t.closest("div.live-sound-tools"))) {
                e.preventDefault();
            }
        }
        if (e.repeat) {
            return;
        }
        let selectEl = document.querySelector("div.select");
        if (!selectEl || selectEl.getAttribute("data-selected") !== "extra") {
            return;
        }
        if (t && t.nodeType === 1 && typeof t.matches === "function"
                && t.matches("input[name='eq-constraint-freq-min'], input[name='eq-constraint-freq-max'], input[name='eq-constraint-freq-graphic-list']")) {
            return;
        }
        if (t.closest && t.closest("div.extra-panel button") && !t.closest("button.play")) {
            if (t.closest("button.extra-eq-constraints-gear")) {
                /* Gear keeps focus after open/close; native Space would toggle the panel instead of play/pause. */
            } else if (t.closest("button.extra-eq-reset-btn") || t.closest("button.live-sound-range-reset-btn")) {
                /* Same as gear: keep global Space → play/pause; avoid trapping focus on reset. */
            } else if (t.closest && t.closest("button.music-add-remove") && musicFileLoaded) {
                e.preventDefault();
            } else {
                return;
            }
        }
        resumeAudioContextsFromUserGesture();
        if (e.shiftKey) {
            e.preventDefault();
            lastToneSpaceKeydownTime = 0;
            let hasMusicSlot = musicFileLoaded && musicPlayButton && musicAudio;
            let playingPink = pinkNoisePlaying;
            let playingTone = !!toneGeneratorOsc;
            let playingMusic = hasMusicSlot && !musicAudio.paused;
            if (playingPink) {
                toneGeneratorPlayButton.click();
            } else if (playingTone) {
                if (hasMusicSlot) {
                    musicPlayButton.click();
                } else {
                    pinkNoisePlayButton.click();
                }
            } else if (playingMusic) {
                pinkNoisePlayButton.click();
            } else {
                let order = hasMusicSlot
                    ? ["pink", "tone", "music"]
                    : ["pink", "tone"];
                let idx = order.indexOf(lastEqPlaybackSource);
                if (idx < 0) {
                    idx = 0;
                }
                let next = order[(idx + 1) % order.length];
                if (next === "pink") {
                    pinkNoisePlayButton.click();
                } else if (next === "tone") {
                    toneGeneratorPlayButton.click();
                } else {
                    musicPlayButton.click();
                }
            }
            return;
        }
        e.preventDefault();
        let now = performance.now();
        if (lastToneSpaceKeydownTime > 0 && now - lastToneSpaceKeydownTime < toneSpaceDoubleMs) {
            lastToneSpaceKeydownTime = 0;
            startToneGeneratorSweep();
            return;
        }
        lastToneSpaceKeydownTime = now;
        if (lastEqPlaybackSource === "tone") {
            toneGeneratorPlayButton.click();
        } else if (lastEqPlaybackSource === "music" && musicFileLoaded && musicPlayButton) {
            musicPlayButton.click();
        } else {
            pinkNoisePlayButton.click();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key !== "\\") return;
        if (!livePlaybackEqToggle) return;
        e.preventDefault();
        if (e.repeat) return;
        livePlaybackEqToggle.checked = false;
        livePlaybackEqToggle.dispatchEvent(new Event("change"));
    });
    document.addEventListener("keyup", (e) => {
        if (e.key !== "\\") return;
        if (!livePlaybackEqToggle) return;
        livePlaybackEqToggle.checked = true;
        livePlaybackEqToggle.dispatchEvent(new Event("change"));
    });

    // Wrap up preamp Calculation Function for plugin
    let calcEqDevPreamp = (filters) => {
        const phoneSelected = eqPhoneSelect.value;
        const phoneObj = phoneSelected &&
            context.activePhones.find(
                (p) => p.fullName === phoneSelected && p.eq
            );

        return context.Equalizer.calc_preamp(
            phoneObj.rawChannels.filter(Boolean)[0],
            phoneObj.eq.rawChannels.filter(Boolean)[0]
        );
    }

    /**
     * Dynamically load a plugin from a sub-folder passing it the useful context
     * @param pluginsToLoad
     * @param context
     * @returns {Promise<void>}
     */
    async function loadPlugins(pluginsToLoad, context) {
        for (const pluginPath of pluginsToLoad) {
            try {
                let initializePlugin;

                if (typeof module !== 'undefined' && module.exports) {
                    // CommonJS environment (e.g., Node.js)
                    initializePlugin = require(pluginPath);
                } else {
                    // ES Module environment (e.g., modern browsers)
                    const module = await import(pluginPath);
                    initializePlugin = module.default;
                }

                // Call the plugin function with the provided context
                await initializePlugin(context);
                console.log(`Successfully loaded plugin: ${pluginPath}`);
            } catch (error) {
                console.error(`Error loading plugin ${pluginPath}:`, error.message);
            }
        }
    }
    // Might come from the config.js
    let config = {showNetwork:false}; // Hide the extra selection of network based devices for now

    // Load the plugin with the provided functions
    if (typeof extraEQplugins !== "undefined") {
        loadPlugins(extraEQplugins, {
            filtersToElem,  // Put Filters back to Html Elements
            elemToFilters,  // Get Filters from Html Elements
            calcEqDevPreamp,// Reuse existing gain calculations
            applyEQ,         // Apply EQ
            config
        });
    }
}
addExtra();

// Add accessories to the bottom of the page, if configured
function addAccessories() {
    let accessoriesBar = document.querySelector("div.accessories"),
        accessoriesContainer = document.createElement("aside");
    
    accessoriesContainer.innerHTML = whichAccessoriesToUse;
    accessoriesBar.append(accessoriesContainer);
}
if (accessories) { addAccessories(); }

// Add header to alt layout
function addHeader() {
    let graphToolContainer = document.querySelector("div.graphtool"),
        altHeaderElem = document.createElement("header"),
        headerButton = document.createElement("button"),
        headerLogoElem = document.createElement("div"),
        headerLogoLink = document.createElement("a"),
        headerLogoImg = document.createElement("img"),
        headerLogoSpan = document.createElement("span"),
        linksList = document.createElement("ul");
    
    headerButton.className = "header-button";
    headerLogoElem.className = "logo";
    headerLogoLink.setAttribute('href', site_url);
    if (headerLogoText) {
        headerLogoSpan.innerText = headerLogoText;
        headerLogoLink.append(headerLogoSpan);
    } else if (headerLogoImgUrl) {
        headerLogoImg.setAttribute("src", headerLogoImgUrl);
        headerLogoLink.append(headerLogoImg);
    }
    
    altHeaderElem.append(headerButton);
    headerLogoElem.append(headerLogoLink);
    altHeaderElem.setAttribute("data-links", "");
    altHeaderElem.append(headerLogoElem);

    altHeaderElem.className = "header";
    graphToolContainer.prepend(altHeaderElem);
    
    linksList.className = "header-links";
    altHeaderElem.append(linksList);
    
    headerLinks.forEach(function(link) {
        let linkContainerElem = document.createElement("li"),
            linkElem = document.createElement("a");
        
        linkElem.setAttribute("href", link.url);
        if ( alt_header_new_tab ) { linkElem.setAttribute("target", "_blank"); }
        if ( link.external ) { linkElem.setAttribute("target", "_blank"); linkElem.classList.add('external'); }
        linkElem.textContent = link.name;
        linkContainerElem.append(linkElem);
        linksList.append(linkContainerElem);
    })
    
    headerButton.addEventListener("click", function() {
        let headerLinksState = altHeaderElem.getAttribute("data-links");
        
        if (headerLinksState === "expanded") {
            altHeaderElem.setAttribute("data-links", "collapsed");
        } else {
            altHeaderElem.setAttribute("data-links", "expanded");
        }
    });
}
if (alt_header) { addHeader(); }

// Add external links to bar at bottom of page, if configured
function addExternalLinks() {
    const externalLinksBar = document.querySelector("div.external-links");

    linkSets.forEach(function(set) {
        let setLabelHtml = document.createElement("span"),
            setLabelText = set.label,
            links = set.links;
        
        setLabelHtml.textContent = setLabelText;
        externalLinksBar.append(setLabelHtml);
        
        links.forEach(function(link) {
            let linkHtml = document.createElement("a"),
                linkName = link.name,
                linkUrl = link.url;
            
            linkHtml.textContent = linkName;
            linkHtml.setAttribute("href", linkUrl);
            externalLinksBar.append(linkHtml);
        });
    });
}
if (externalLinksBar) { addExternalLinks(); }

// Add tutorial to alt layout
function addTutorial() {
    let partsPrimary = document.querySelector("section.parts-primary")
        graphContainer = document.querySelector("div.graph-sizer"),
        manageContainer = document.querySelector("div.manage"),
        overlayContainer = document.createElement("div"),
        buttonContainer = document.createElement("div"),
        descriptionContainer = document.createElement("div"),
        zoomButtons = document.querySelectorAll("div.zoom button");
    
    overlayContainer.className = "tutorial-overlay";
    graphContainer.prepend(overlayContainer);
    
    buttonContainer.className = "tutorial-buttons";
    descriptionContainer.className = "tutorial-description";
    
    manageContainer.prepend(descriptionContainer);
    manageContainer.prepend(buttonContainer);
    
    tutorialDefinitions.forEach(function(def) {
        let defOverlay = document.createElement("div"),
            defButton = document.createElement("button"),
            defDescription = document.createElement("article"),
            defDescriptionCopy = document.createElement("p");
        
        defOverlay.setAttribute("tutorial-def", def.name);
        defOverlay.setAttribute("tutorial-on", "false");
        defOverlay.className = "overlay-segment";
        defOverlay.setAttribute("style", "flex-basis: "+ def.width +";")
        overlayContainer.append(defOverlay);
        
        defButton.setAttribute("tutorial-def", def.name);
        defButton.setAttribute("tutorial-on", "false");
        defButton.className = "button-segment";
        defButton.textContent = def.name;
        buttonContainer.append(defButton);
        
        defDescription.setAttribute("tutorial-def", def.name);
        defDescription.setAttribute("tutorial-on", "false");
        defDescription.className = "description-segment";
        defDescriptionCopy.innerHTML = def.description;
        defDescription.append(defDescriptionCopy);
        descriptionContainer.append(defDescription);
        
        defButton.addEventListener("click", function() {
            let activeStatus = defButton.getAttribute("tutorial-on"),
                activeTutorialElements = document.querySelectorAll("[tutorial-on='true']"),
                activeOverlay = document.querySelector("div.overlay-segment[tutorial-on='true']"),
                activeButton = document.querySelector("button.button-segment[tutorial-on='true']"),
                activeDescription = document.querySelector("article.description-segment[tutorial-on='true']");
            
            if (activeOverlay) { activeOverlay.setAttribute("tutorial-on", "false"); }
            if (activeButton) { activeButton.setAttribute("tutorial-on", "false"); }
            
            if (activeStatus === "false") {
                if (activeDescription) { activeDescription.setAttribute("tutorial-on", "false"); }
                
                defOverlay.setAttribute("tutorial-on", "true");
                defButton.setAttribute("tutorial-on", "true");
                defDescription.setAttribute("tutorial-on", "true");
                
                partsPrimary.setAttribute("tutorial-active", "true");
                disableZoom();
                
                // Analytics event
                if (analyticsEnabled) { pushEventTag("tutorial_activated", targetWindow, def.name); }
            } else {
                partsPrimary.setAttribute("tutorial-active", "false");
            }
        });
        
        defButton.addEventListener("mouseover", function() {
            defOverlay.setAttribute("tutorial-hover", "true");
        });
        
        defButton.addEventListener("mouseout", function() {
            defOverlay.setAttribute("tutorial-hover", "false");
        });
        
        defButton.addEventListener("touchend", function() {
            defOverlay.setAttribute("tutorial-hover", "false");
        });
    });
    
    // Disable zoom if tutorial is engaged
    function disableZoom() {
        let activeZoomButton = document.querySelector("div.zoom button.selected");
        
        if (activeZoomButton) { activeZoomButton.click(); }
    }
    
    // Disable tutorial if zoom is engaged
    zoomButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            let tutorialState = document.querySelector("section.parts-primary").getAttribute("tutorial-active");
            
            if (button.classList.contains("selected") && tutorialState === "true") {
                let activeOverlay = document.querySelector("div.overlay-segment[tutorial-on='true']"),
                    activeButton = document.querySelector("button.button-segment[tutorial-on='true']"),
                    activeDescription = document.querySelector("article.description-segment[tutorial-on='true']");
                
                document.querySelector("section.parts-primary").setAttribute("tutorial-active","false");
                activeOverlay.setAttribute("tutorial-on", "false");
                activeButton.setAttribute("tutorial-on", "false");
            }
        });
    });
}
if (alt_tutorial) { addTutorial(); }

// Set active graph site link
function setActiveDatabase() {
    let url = targetWindow.location.href,
        dbLinks = document.querySelectorAll("div.external-links a");

    dbLinks.forEach(function(link) {
        let linkUrl = link.getAttribute("href");

        if ( url.includes(linkUrl) ) {
            link.setAttribute("class", "active");
        }
    });
}
setActiveDatabase();

// Expand / collapse function
function toggleExpandCollapse() {
    const graphIsIframe = (window.top !== window.self) ? true:false,
        graphBody = document.querySelector("body"),
        parentBody = window.top.document.querySelector("body"),
        expandCollapseButton = document.querySelector("button#expand-collapse");
    
    
    if ( graphIsIframe) { graphBody.setAttribute("data-graph-frame", "collapsed"); }
    
    
    if ( graphIsIframe && expandableOnly ) {
        const expandOnlyMax = ( expandableOnly === true ) ? 1000000:expandableOnly,
            expandOnlyStyle = document.createElement("style"),
            expandOnlyCss = `
            @media ( max-width: `+ expandOnlyMax +`px ) {
                body[data-expandable="only"][data-graph-frame="collapsed"] {
                    overflow: hidden;
                }

                body[data-expandable="only"][data-graph-frame="collapsed"] div.expand-collapse {
                    position: fixed;
                    top: 0;
                    left: 0;

                    display: flex;
                    justify-content: center;
                    align-items: center;

                    width: 100%;
                    height: 100%;
                    padding: 0;

                    background-color: var(--background-color);
                    background-color: transparent;
                    border: none;
                }

                body[data-expandable="only"][data-graph-frame="collapsed"] div.expand-collapse:after {
                    position: absolute;

                    content: 'Tap to launch graph tool';

                    color: var(--font-color-primary);
                    font-family: var(--font-secondary);
                    font-size: 11px;
                    line-height: 1em;
                    text-transform: uppercase;

                    pointer-events: none;
                }

                body[data-expandable="only"][data-graph-frame="collapsed"] div.expand-collapse button#expand-collapse {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    width: 100%;
                    height: 100%;

                    background-color: transparent;
                }

                body[data-expandable="only"][data-graph-frame="collapsed"] div.expand-collapse button#expand-collapse:before {
                    position: relative;
                    z-index: 1;

                    transform: scale(7);
                }

                body[data-expandable="only"][data-graph-frame="collapsed"] div.expand-collapse button#expand-collapse:after {
                    position: absolute;
                    top: 0;
                    left: 0;

                    content: '';

                    display: block;
                    width: 100%;
                    height: 100%;

                    background-color: var(--background-color);

                    opacity: 0.9;
                }

                body[data-expandable="only"][data-graph-frame="collapsed"] section.parts-primary {
                    flex: 100% 1 1;
                    overflow: hidden;
                }

                body[data-expandable="only"][data-graph-frame="collapsed"] section.parts-secondary {
                    display: none;
                }
            }
        `;
        
        expandOnlyStyle.textContent = expandOnlyCss;
        expandOnlyStyle.setAttribute("type", "text/css");
        document.querySelector("body").append(expandOnlyStyle);
        
        graphBody.setAttribute("data-expandable", "only");
    } else if ( graphIsIframe && expandable ) {
        graphBody.setAttribute("data-expandable", "true");
    }
    
    const parentStyle = window.top.document.createElement("style"),
          parentCss = `
            :root {
                --header-height: `+ headerHeight +`;
            }
            
            body[data-graph-frame="expanded"] {
                width: 100%;
                height: 100%;
                max-height: -webkit-fill-available;
                overflow: hidden;
            }
            
            body[data-graph-frame="expanded"] button.graph-frame-collapse {
                display: inherit;
            }
            
            body[data-graph-frame="expanded"] iframe#GraphTool {
                position: fixed;
                top: var(--header-height);
                left: 0;
                
                width: 100% !important;
                height: calc(100% - var(--header-height)) !important;

                animation-name: graph-tool-expand;
                animation-duration: 0.15s;
                animation-iteration-count: 1;
                animation-timing-function: ease-out;
                animation-fill-mode: forwards;
            }

            @keyframes graph-tool-expand {
                0% {
                    position: relative;
                    opacity: 1.0;
                    transform: scale(1.0);
                }
                48% {
                    position: relative;
                    opacity: 0.0;
                    transform: scale(0.9);
                }
                50% {
                    position: fixed;
                    opacity: 0.0;
                    transform: scale(0.9);
                }
                52% {
                    position: fixed;
                    opacity: 0.0;
                    transform: scale(0.9);
                }
                100% {
                    position: fixed;
                    opacity: 1.0;
                    transform: scale(1.0);
                }
            }`;
    
    parentStyle.textContent = parentCss;
    parentStyle.setAttribute("type", "text/css");
    parentBody.append(parentStyle);
    
    expandCollapseButton.addEventListener("click", function(e) {
        let frameState = document.querySelector("body").getAttribute("data-graph-frame");
        
        if ( frameState === "expanded" ) {
            graphBody.setAttribute("data-graph-frame", "collapsed");
            parentBody.setAttribute("data-graph-frame", "collapsed");
        } else {
            graphBody.setAttribute("data-graph-frame", "expanded");
            parentBody.setAttribute("data-graph-frame", "expanded");
        }
        
        e.stopPropagation();
    });
        
}

if ( expandable && accessDocumentTop ) { toggleExpandCollapse(); }

// Update user config for target + baseline
function setUserConfig() {
    let urlObj = new URL(document.URL),
        pathClean = urlObj.pathname.replace(/\W/g, ""),
        configName = pathClean.length > 0 ? "_" + pathClean + "_a" : "_a",
        configJson = {
            "phones": [],
            "normalMode": (norm_sel === 1) ? "Hz" : "dB",
            "normalValue": (norm_sel === 1) ? norm_fr : norm_phon
        },
        activeBaseline = baseline.p ? baseline.p.fileName : 0;
    
    activePhones.forEach(function(phone) {
        let phoneJson = {},
            fullName = phone.fullName,
            fileName = phone.fileName,
            isTarget = phone.isTarget ? phone.isTarget : false,
            isHidden = phone.hide ? phone.hide : false,
            isBaseline = fileName === activeBaseline ? true : false,
            isPinned = phone.pin ? phone.pin : false;
        
        if (isTarget || isBaseline) {
            phoneJson.fullName = fullName;
            phoneJson.fileName = fileName;
            phoneJson.isTarget = isTarget;
            phoneJson.isHidden = isHidden;
            phoneJson.isBaseline = isBaseline;
            phoneJson.isPinned = isPinned;
            
            configJson.phones.push(phoneJson);
        }
    });
    
    localStorage.setItem("userConfig" + configName, JSON.stringify(configJson));
}

// Insert user config phones to inits
function userConfigAppendInits(initReq) {
    if (targetRestoreLastUsed) {
        let urlObj = new URL(document.URL),
            pathClean = urlObj.pathname.replace(/\W/g, ""),
            configName = pathClean.length > 0 ? "_" + pathClean + "_a" : "_a",
            configJson = JSON.parse(localStorage.getItem("userConfig" + configName)),
            configNumOfPhones = configJson ? configJson.phones.length : 0;

        if (configJson && configNumOfPhones) {
            initReq.slice(0).forEach(function(item) {
                if (item && typeof item.endsWith === "function" && item.endsWith(" Target")) {
                    initReq.splice(initReq.indexOf(item), 1);
                }
            });

            configJson.phones.forEach(function(phone) {
                if (!initReq.includes(phone.fileName)) {
                    initReq.push(phone.fileName);
                }
            });
        }
    }
}

// Apply baseline and hide settings
function userConfigApplyViewSettings(phoneInTable) {
    if (targetRestoreLastUsed) {
        userConfigApplicationActive = 1;

        let urlObj = new URL(document.URL),
            pathClean = urlObj.pathname.replace(/\W/g, ""),
            configName = pathClean.length > 0 ? "_" + pathClean + "_a" : "_a",
            configJson = JSON.parse(localStorage.getItem("userConfig" + configName));

        if (configJson) {
            let phone = configJson.phones.find(item => item.fileName === phoneInTable);

            if (typeof phone !== "undefined") {
                let row = document.querySelector("tr[data-filename='"+ phone.fileName +"'][data-manage-main='1']"),
                    hideButton = row && row.querySelector("td.hideIcon"),
                    baselineButton = row && row.querySelector("td.button-baseline"),
                    pinButton = row && row.querySelector("td.button-pin");

                if (phone.isHidden && hideButton
                        && !hideButton.classList.contains("selected")) {
                    hideButton.click();
                }

                if (phone.isBaseline && baselineButton
                        && !baselineButton.classList.contains("selected")) {
                    baselineButton.click();
                }

                if (phone.isPinned && pinButton
                        && pinButton.getAttribute("data-pinned") !== "true") {
                    pinButton.click();
                }
            }
        }

        userConfigApplicationActive = 0;
    }
};

// Apply normalization config
function userConfigApplyNormalization() {
    userConfigApplicationActive = 1;
    
    let urlObj = new URL(document.URL),
        pathClean = urlObj.pathname.replace(/\W/g, ""),
        configName = pathClean.length > 0 ? "_" + pathClean + "_a" : "_a",
        configJson = JSON.parse(localStorage.getItem("userConfig" + configName));
    
    if ( configJson && configJson.normalMode === "Hz" ) {
        document.querySelector("input#norm-fr").value = configJson.normalValue;
        document.querySelector("input#norm-fr").dispatchEvent(new Event("change"));
    } else if ( configJson && configJson.normalMode === "dB" ) {
        document.querySelector("input#norm-phon").value = configJson.normalValue;
        document.querySelector("input#norm-phon").dispatchEvent(new Event("change"));
    }
    
    userConfigApplicationActive = 0;
}
