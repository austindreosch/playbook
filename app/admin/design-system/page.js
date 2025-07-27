'use client';

import { texts } from '../../../tailwind.config';

const colorCategories = {
  neutral: ['0', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', 'alpha-24', 'alpha-16', 'alpha-10'],
  blue: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', 'alpha-24', 'alpha-16', 'alpha-10'],
  orange: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', 'alpha-24', 'alpha-16', 'alpha-10'],
  red: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', 'alpha-24', 'alpha-16', 'alpha-10'],
  green: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', 'alpha-24', 'alpha-16', 'alpha-10'],
  yellow: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', 'alpha-24', 'alpha-16', 'alpha-10'],
  purple: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', 'alpha-24', 'alpha-16', 'alpha-10'],
  sky: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', 'alpha-24', 'alpha-16', 'alpha-10'],
  pink: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', 'alpha-24', 'alpha-16', 'alpha-10'],
  teal: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', 'alpha-24', 'alpha-16', 'alpha-10'],
  white: ['DEFAULT', 'alpha-24', 'alpha-16', 'alpha-10'],
  black: ['DEFAULT', 'alpha-24', 'alpha-16', 'alpha-10'],
  primary: ['dark', 'darker', 'base', 'alpha-24', 'alpha-16', 'alpha-10', 'DEFAULT', 'foreground'],
  static: ['black', 'white'],
  bg: ['strong-950', 'surface-800', 'sub-300', 'soft-200', 'weak-50', 'white-0'],
  text: ['strong-950', 'sub-600', 'mid-500', 'soft-400', 'disabled-300', 'white-0'],
  stroke: ['strong-950', 'sub-300', 'soft-200', 'white-0'],
  faded: ['dark', 'base', 'light', 'lighter'],
  information: ['dark', 'base', 'light', 'lighter'],
  warning: ['dark', 'base', 'light', 'lighter'],
  error: ['dark', 'base', 'light', 'lighter'],
  success: ['dark', 'base', 'light', 'lighter'],
  away: ['dark', 'base', 'light', 'lighter'],
  feature: ['dark', 'base', 'light', 'lighter'],
  verified: ['dark', 'base', 'light', 'lighter'],
  highlighted: ['dark', 'base', 'light', 'lighter'],
  stable: ['dark', 'base', 'light', 'lighter'],
  social: ['apple', 'twitter', 'github', 'notion', 'tidal', 'amazon', 'zendesk'],
  illustration: ['white-0', 'weak-100', 'soft-200', 'sub-300', 'strong-400'],
  pb_blue: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'DEFAULT'],
  pb_orange: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'DEFAULT'],
  pb_green: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'DEFAULT'],
  pb_red: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'DEFAULT']
};

const textCategories = {
  'Title': ['title-h1', 'title-h2', 'title-h3', 'title-h4', 'title-h5', 'title-h6'],
  'Label': ['label-xl', 'label-lg', 'label-md', 'label-sm', 'label-xs'],
  'Paragraph': ['paragraph-xl', 'paragraph-lg', 'paragraph-md', 'paragraph-sm', 'paragraph-xs'],
  'Subheading': ['subheading-md', 'subheading-sm', 'subheading-xs', 'subheading-2xs'],
  'Documentation': ['doc-label', 'doc-paragraph']
};

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-bg-white-0 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-title-h1 text-text-strong-950 mb-4">Design System Showcase</h1>
          <p className="text-paragraph-lg text-text-sub-600">Typography and Color Palette Reference</p>
        </div>

        {/* Typography Section */}
        <section className="space-y-8">
          <h2 className="text-title-h2 text-text-strong-950 border-b border-stroke-soft-200 pb-4">Typography System</h2>
          
          {Object.entries(textCategories).map(([category, sizes]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-title-h4 text-text-sub-600">{category}</h3>
              <div className="space-y-3">
                {sizes.map((size) => {
                  const textConfig = texts[size];
                  const fontSize = Array.isArray(textConfig) ? textConfig[0] : textConfig;
                  const lineHeight = Array.isArray(textConfig) && textConfig[1] ? textConfig[1].lineHeight : 'auto';
                  const fontWeight = Array.isArray(textConfig) && textConfig[1] ? textConfig[1].fontWeight : '400';
                  const letterSpacing = Array.isArray(textConfig) && textConfig[1] ? textConfig[1].letterSpacing : '0em';
                  
                  return (
                    <div key={size} className="flex items-center gap-8 p-4 bg-bg-weak-50 rounded-lg border border-stroke-soft-200">
                      <div className="min-w-32">
                        <code className="text-subheading-sm text-text-sub-600">{size}</code>
                      </div>
                      <div className={`text-${size} text-text-strong-950 flex-1`}>
                        The quick brown fox jumps over the lazy dog
                      </div>
                      <div className="text-paragraph-sm text-text-soft-400 space-y-1 min-w-48">
                        <div>Size: {fontSize}</div>
                        <div>Line: {lineHeight}</div>
                        <div>Weight: {fontWeight}</div>
                        <div>Spacing: {letterSpacing}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Color Palette Section */}
        <section className="space-y-8">
          <h2 className="text-title-h2 text-text-strong-950 border-b border-stroke-soft-200 pb-4">Color Palette</h2>
          
          {Object.entries(colorCategories).map(([category, shades]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-title-h4 text-text-sub-600 capitalize">{category.replace('_', ' ')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {shades.map((shade) => {
                  const colorClass = `${category}-${shade}`;
                  const bgClass = `bg-${colorClass}`;
                  const textClass = `text-${colorClass}`;
                  
                  return (
                    <div key={shade} className="space-y-2">
                      <div 
                        className={`${bgClass} w-full h-16 rounded-lg border border-stroke-soft-200 shadow-sm`}
                        style={{ minHeight: '64px' }}
                      />
                      <div className="space-y-1">
                        <div className="text-subheading-xs text-text-strong-950 font-medium">{shade}</div>
                        <div className="text-subheading-2xs text-text-soft-400 font-mono">{colorClass}</div>
                        <div className={`${textClass} text-subheading-xs`}>Text sample</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* CSS Variables Reference */}
        <section className="space-y-8">
          <h2 className="text-title-h2 text-text-strong-950 border-b border-stroke-soft-200 pb-4">CSS Variables Reference</h2>
          <div className="bg-bg-weak-50 rounded-lg p-6 border border-stroke-soft-200">
            <p className="text-paragraph-md text-text-sub-600 mb-4">
              All colors use CSS custom properties. For example:
            </p>
            <div className="space-y-2 text-subheading-sm font-mono">
              <div className="text-text-strong-950">--neutral-500: 107 114 128;</div>
              <div className="text-text-strong-950">--primary-base: 59 130 246;</div>
              <div className="text-text-strong-950">--bg-white-0: 255 255 255;</div>
              <div className="text-text-strong-950">--text-strong-950: 3 7 18;</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}