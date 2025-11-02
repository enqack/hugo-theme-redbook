# ITW Theme

## Set-up

### Configuration

The following setting definitions are required in the site-level hugo config file(s); `hugo.yaml`.

```yaml
markup:
  _merge: deep
```

The following parameters are avaiable for the theme.

```ymal
params:
  github_repository: https://github.com/user/repo  # Site source repo
  version: v1                                      # site version
  sidebar:                                         # sibebar menu settings
    enabled: true                                  ## Enable sidebar menu
    menu_style: static-menu                        ## Set menu design
    menu_cycle: true                               ## Cycle back to begining of menu
  math: true                                       # Enable/disable LaTeX rendering
  mermaid: true                                    # Enable/disable Mermaid diagram rendering
```

### Build

```bash
hugo mod get
hugo mod npm pack # compose package.json from theme(s)
npm install
hugo
```
