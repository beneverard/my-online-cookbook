const Image = require('@11ty/eleventy-img');
const util = require('util');

module.exports = config => {
    config.setUseGitIgnore(false);
    config.addWatchTarget("./src/_includes/css/main.css");

    config.addPassthroughCopy({ public: './' });
    config.addPassthroughCopy('src/img');
    config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/admin');


    /* Collections */
    config.addCollection('recipes', collection => {
		return collection
			.getFilteredByGlob('./src/recipes/*.md')
			.sort((a, b) => {
				if (a.data.title < b.data.title) {
					return -1;
				}

				if (a.data.title > b.data.title) {
					return 1;
				}

				// a must be equal to b
				return 0;
			});
    });

    config.addCollection('tagList', collection => {
        const tagsSet = new Set();
        collection.getAll().forEach(item => {
          if (!item.data.tags) return;
          item.data.tags
            .filter(tag => !['recipes'].includes(tag))
            .forEach(tag => tagsSet.add(tag));
        });
        return Array.from(tagsSet).sort((first, second) => {
            const firstStartingLetter = first.trim()[0].toLowerCase();
            const secondStartingLetter = second.trim()[0].toLowerCase();

            if(firstStartingLetter < secondStartingLetter) { return -1; }
            if(firstStartingLetter > secondStartingLetter) { return 1; }
            return 0;
        });
    });


    /* Filters */
    config.addFilter('console', function(value) {
        return util.inspect(value);
    });

    config.addFilter('lowercase', function(value) {
        return value.toLowerCase();
    });

    /* Shortcodes */
    const imageShortcode = async (src, className, alt, sizes) => {
        let metadata = await Image(src.includes('http') ? src : `./src/${src}`, {
            widths: [600, 1500, 3000],
            formats: ['webp', 'jpeg'],
            outputDir: './_site/img/recipes',
            urlPath: '/img/recipes/'
        });

        let imageAttributes = {
            class: className,
            alt,
            sizes,
            loading: "lazy",
            decoding: "async"
        };

        return Image.generateHTML(metadata, imageAttributes);
    }

    config.addNunjucksAsyncShortcode('recipeimage', imageShortcode);
    config.addShortcode('year', () => `${new Date().getFullYear()}`);

    return {
        dir: {
            input: 'src',
            output: '_site',
            includes: '_includes',
            data: '_data'
        },
        passthroughFileCopy: true
    }
};
