# 🤝 Contributing to MTech

Thank you for your interest in contributing to MTech by Maurya Enterprises! This document provides guidelines and information for contributors.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community Guidelines](#community-guidelines)

---

## 📜 Code of Conduct

### Our Pledge
We pledge to make participation in MTech a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement
Project maintainers have the right to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned with this Code of Conduct.

---

## 🚀 How to Contribute

### Types of Contributions We Welcome
- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- 🔧 **Performance optimizations**
- 🧪 **Test coverage improvements**
- 🌐 **Internationalization**
- 📱 **Mobile responsiveness**

### Before You Start
1. **Check existing issues** to see if your contribution is already being worked on
2. **Create an issue** to discuss major changes before implementing
3. **Fork the repository** and create a feature branch
4. **Follow our coding standards** (see below)

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js** 14+ and npm
- **Git** for version control
- **Code editor** (VS Code recommended)

### Local Development Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mtech.git
cd mtech

# Install dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local settings

# Start development server
npm run dev

# In another terminal, serve frontend
cd ../frontend
# Open index.html in browser or use live server
```

### Database Setup
```bash
# Initialize database with sample data
node -e "const DB = require('./database.js'); new DB().initialize();"
```

### Testing
```bash
# Run backend tests
npm test

# Run frontend tests (if available)
cd ../frontend
npm test
```

---

## 📏 Coding Standards

### JavaScript
- **ES6+** features preferred
- **2 spaces** for indentation
- **Semicolons** required
- **camelCase** for variables and functions
- **PascalCase** for classes and constructors
- **UPPER_SNAKE_CASE** for constants

**Example:**
```javascript
// Good
const API_BASE_URL = 'https://api.mtech.com';

class ProductManager {
  constructor(config) {
    this.apiUrl = config.apiUrl;
  }

  async fetchProducts() {
    try {
      const response = await fetch(`${this.apiUrl}/products`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }
}

// Bad
var api_base_url = 'https://api.mtech.com'

class productmanager {
    constructor(config){
        this.apiUrl=config.apiUrl
    }

    async fetchProducts(){
        const response = await fetch(this.apiUrl + '/products')
        return response.json()
    }
}
```

### HTML
- **Semantic HTML5** elements
- **2 spaces** for indentation
- **Lowercase** tag names and attributes
- **Alt text** for all images
- **Proper nesting** and closing tags

```html
<!-- Good -->
<article class="product-card">
  <img src="product.jpg" alt="Arduino UNO R3 microcontroller board">
  <h3 class="product-title">Arduino UNO R3</h3>
  <p class="product-description">Perfect for electronics projects</p>
</article>

<!-- Bad -->
<DIV class="product-card">
  <IMG src="product.jpg">
  <H3>Arduino UNO R3</H3>
  <P>Perfect for electronics projects
</DIV>
```

### CSS
- **Mobile-first** responsive design
- **2 spaces** for indentation
- **CSS custom properties** for theming
- **BEM methodology** for class naming

```css
/* Good */
.product-card {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  background: var(--color-surface);
}

.product-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.product-card__title--featured {
  color: var(--color-accent);
}

/* Bad */
.productCard {
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-radius: 8px;
    background: #ffffff;
}

.productCardTitle {
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
}
```

### Documentation
- **JSDoc comments** for functions and classes
- **README updates** for significant changes
- **API documentation** for new endpoints
- **Inline comments** for complex logic

```javascript
/**
 * Calculates the total price including tax and shipping
 * @param {Object} cart - Shopping cart object
 * @param {number} cart.subtotal - Subtotal amount
 * @param {number} cart.taxRate - Tax rate (e.g., 0.18 for 18%)
 * @param {number} cart.shippingCost - Shipping cost
 * @returns {number} Total price including all charges
 */
function calculateTotal(cart) {
  const taxAmount = cart.subtotal * cart.taxRate;
  return cart.subtotal + taxAmount + cart.shippingCost;
}
```

---

## 🔄 Pull Request Process

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes
- Follow coding standards
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Commit Your Changes
Use conventional commit messages:
```bash
git commit -m "feat: add product search functionality"
git commit -m "fix: resolve cart quantity update issue"
git commit -m "docs: update API documentation for reviews"
git commit -m "style: improve mobile responsive design"
git commit -m "refactor: optimize database queries"
git commit -m "test: add unit tests for cart operations"
```

**Commit Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting, UI improvements
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 4. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

**Pull Request Template:**
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published
```

### 5. Code Review Process
- **Automated checks** must pass
- **At least one review** from a maintainer
- **Address feedback** promptly
- **Squash commits** if requested
- **Maintainer merges** approved PRs

---

## 🐛 Issue Reporting

### Before Creating an Issue
1. **Search existing issues** to avoid duplicates
2. **Check documentation** and FAQ
3. **Try latest version** to see if issue persists

### Bug Report Template
```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
 - Browser: [e.g. Chrome 95, Firefox 94, Safari 15]
 - Node.js Version: [e.g. 16.13.0]
 - MTech Version: [e.g. 1.0.0]

**Additional Context**
Add any other context about the problem here.
```

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

---

## 👥 Community Guidelines

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community discussions
- **Email**: contact@mtech.com for private matters

### Getting Help
1. **Read the documentation** first
2. **Search existing issues** and discussions
3. **Ask specific questions** with context
4. **Provide minimal reproducible examples**

### Recognition
Contributors will be recognized in:
- **README.md** contributors section
- **CHANGELOG.md** for significant contributions
- **GitHub releases** notes
- **Social media** shoutouts

---

## 🏷️ Labels and Workflow

### Issue Labels
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - Critical issues
- `priority: medium` - Standard priority
- `priority: low` - Nice to have

### Project Boards
We use GitHub Projects to track progress:
- **Backlog** - Planned features and improvements
- **In Progress** - Currently being worked on
- **Review** - Awaiting code review
- **Done** - Completed and merged

---

## 🎯 Development Priorities

### Current Focus Areas
1. **Performance optimization**
2. **Mobile responsiveness**
3. **Accessibility improvements**
4. **Test coverage**
5. **API documentation**

### Future Roadmap
- User authentication system
- Payment integration
- Admin dashboard
- Mobile app
- Multi-language support
- Advanced search and filtering

---

## 📞 Contact

### Maintainers
- **Maurya Enterprises Team** - contact@mtech.com

### Support
- **Technical Issues**: Create a GitHub issue
- **Security Concerns**: security@mtech.com
- **Business Inquiries**: business@mtech.com

---

## 📄 License

By contributing to MTech, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to MTech! 🚀**

Together, we're building the best electronics store platform for the maker community in India.

**© 2025 Maurya Enterprises. All rights reserved.**
