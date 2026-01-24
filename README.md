# Zygmunt's Blog

A Jekyll-based static website/blog. A bit about AI, a bit about musicals.

## Prerequisites

Before running this site locally, you need to have the following installed:

- **Ruby** (3.0 or later)
- **Bundler** (Ruby gem package manager)
- **Build tools** (for compiling native extensions)

### Installing Prerequisites on Ubuntu/Debian

```bash
# Install Ruby and development tools
sudo apt-get update
sudo apt-get install -y ruby-full ruby-dev build-essential

# Install Bundler
gem install bundler
```

## Installation

1. **Clone or navigate to the repository:**
   ```bash
   cd zlenyk.github.io
   ```

2. **Configure Bundler to install gems locally** (avoids permission issues):
   ```bash
   bundle config set path 'vendor/bundle'
   ```

3. **Install dependencies:**
   ```bash
   bundle install
   ```

   This will install all required gems (including Jekyll) into the `vendor/bundle` directory within the project.

## Running the Site Locally

Start the Jekyll development server:

```bash
bundle exec jekyll serve
```

By default, the site will be available at **http://localhost:4000**

The server will automatically rebuild the site when you make changes to files.

### Using a Different Port

If port 4000 is already in use, you can specify a different port:

```bash
bundle exec jekyll serve --port 4001
```

Or any other available port:

```bash
bundle exec jekyll serve --port 8080
```

### Additional Options

- **With live reload** (auto-refreshes browser on changes):
  ```bash
  bundle exec jekyll serve --livereload
  ```

- **Include draft posts** (posts in `_drafts/` directory):
  ```bash
  bundle exec jekyll serve --drafts
  ```

- **Custom host and port** (make accessible from other devices on your network):
  ```bash
  bundle exec jekyll serve --host 0.0.0.0 --port 4001
  ```

- **Combine options** (e.g., different port with live reload):
  ```bash
  bundle exec jekyll serve --port 4001 --livereload
  ```

## Common Commands

- **Build the site** (without serving):
  ```bash
  bundle exec jekyll build
  ```

- **Build for production** (with optimizations):
  ```bash
  bundle exec jekyll build --config _config.yml
  ```

- **Clean build artifacts:**
  ```bash
  bundle exec jekyll clean
  ```

- **Update dependencies:**
  ```bash
  bundle update
  ```

## Troubleshooting

### Permission Errors

If you encounter permission errors when running `bundle install`, make sure you've configured Bundler to install gems locally:

```bash
bundle config set path 'vendor/bundle'
```

### Missing Ruby Development Headers

If you see errors about missing header files (`ruby.h`), install the Ruby development package:

```bash
sudo apt-get install ruby-dev
```

### Port Already in Use

If port 4000 is already in use, see the [Using a Different Port](#using-a-different-port) section above for instructions on how to run Jekyll on a different port.

## Project Structure

- `_config.yml` - Jekyll configuration file
- `_posts/` - Blog posts (markdown files)
- `_layouts/` - HTML layouts
- `_includes/` - Reusable HTML components
- `public/` - Static assets
- `index.html` - Homepage
- `Gemfile` - Ruby dependencies

## Deployment

This site is configured for GitHub Pages. Simply push to the repository and GitHub Pages will automatically build and deploy the site.

For manual deployment, build the site and upload the `_site` directory to your web server:

```bash
bundle exec jekyll build
# Upload the contents of _site/ to your web server
```

## License

See repository for license information.

