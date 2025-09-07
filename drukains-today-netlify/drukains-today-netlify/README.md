# Drukains Today - Netlify Static Version

A modern school news and forum website optimized for static hosting on Netlify.

## 🚀 Features

- **Responsive Design**: Works perfectly on desktop and mobile devices
- **User Authentication**: Mock authentication system with different user roles
- **Content Management**: Articles, announcements, and reminders
- **Voting System**: Users can vote on posts
- **Admin Dashboard**: Administrative interface for content management
- **Bootstrap 5**: Modern, professional UI components

## 🎭 Demo Accounts

This static version includes demo accounts for testing:

- **Admin**: `admin` / `admin123`
- **Teacher**: `teacher_lang` / `teacher123`  
- **Student**: `student1` / `student123`

## 📁 Project Structure

```
drukains-today-netlify/
├── index.html              # Main HTML file
├── styles.css              # Custom CSS styles
├── script-static.js        # Static JavaScript with mock data
├── favicon.ico             # Website icon
├── netlify.toml            # Netlify configuration
├── package.json            # Node.js package configuration
└── README.md               # This file
```

## 🌐 Deployment on Netlify

### Option 1: Drag and Drop Deployment

1. Create a ZIP file of all the files in this directory
2. Go to [Netlify](https://netlify.com)
3. Drag and drop the ZIP file onto the Netlify dashboard
4. Your site will be deployed automatically!

### Option 2: Git-based Deployment

1. Push this code to a GitHub repository
2. Connect your GitHub account to Netlify
3. Select the repository and branch
4. Netlify will automatically detect the configuration from `netlify.toml`
5. Deploy!

### Option 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from this directory
netlify deploy

# Deploy to production
netlify deploy --prod
```

## ⚙️ Configuration

The `netlify.toml` file includes:

- **Build settings**: No build process required (static files)
- **Redirects**: SPA-style routing (all routes go to index.html)
- **Security headers**: Basic security headers for production

## 🔧 Customization

### Adding Content

Edit the `mockData` object in `script-static.js` to modify:

- User accounts
- Posts (articles, announcements, reminders)
- Monthly winners

### Styling

- Modify `styles.css` for custom styling
- The project uses Bootstrap 5 for base components
- Font Awesome icons are included

### Functionality

- Add new features by extending the JavaScript functions
- The code is modular and well-commented for easy modification

## 🏗️ Original Flask Version

This static version is based on a Flask application. If you need:

- Real user authentication
- Database persistence
- Server-side functionality
- User registration

Consider deploying the original Flask version on platforms like:

- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

For questions about deployment or customization, please refer to:

- [Netlify Documentation](https://docs.netlify.com/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Font Awesome Icons](https://fontawesome.com/icons)

