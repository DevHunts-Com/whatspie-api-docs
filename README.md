# Whatspie Api Documentation

## Table of Contents
1. [Requirements](#requirements)
2. [Instalation](#installation)
3. [Step for build docs](#step-for-build-content)
    - 1. [Start Using Template](#starting-using-template)
    - 2. [How to add method in onces URL](#how-do-i-add-custom-multiple-url-postputdeleteget-endpoint-while-using-template-2-)
    - 3. [How to update content the docs](#how-to-update-content-on-docs)
4. [Note](#note)


## Requirements

- Yarn >= 1.22.19

## Installation

- Clone whatspie doc
- `yarn install`
- `yarn start`

-----------------------------------------------------------------------------------------------------------------

# Step for build content
### Command for clear docs
- `yarn docusaurus clean-api-docs whatspie`

### Command for generate docs from .yaml
- `yarn docusaurus gen-api-docs whatspie`

-----------------------------------------------------------------------------------------------------------------

#  Starting Using Template
> the docs have 2 template
> - you can configure on `docusaurus.config` and change by name of file for using different template 
## 1. template 1
- the file name is `whatspie-v2-theme-1.yaml`
- this is a simple template, you just follow [Step for build content](#step-for-build-content)
- `yarn start`

## 2. template 2
- the file name is `whatspie-v2-theme-2.yaml`
- this is tricky template, you need some step for using this one

> 1. Follow the instruction [Step for build content](#step-for-build-content)

> 2. Copy from `examples/yaml-theme-2/mdx` and paste it to `docs/whatspie` Details in [Note](#Note)
> 3. Copy `whatspie-v2-theme-2-sidebar.js` then paste it to `docs/whatspie/sidebar.js` 
> - 1. if you have some changes (custom endpoint or etc) for sidebar i recommended to edit `whatspie-v2-theme-2-sidebar.js` then update to `sidebar.js`
> 4. `yarn start`


## How do i add custom (Multiple URL (POST,PUT,DELETE,GET)) endpoint while using template [2](#2.-template-2) ?
> 1. Clean the docs
> 2. Create yaml on path `examples/yaml-theme-2/` egs: `send-data.yaml` 
> 3. Copy content of `whatspie-v2-theme-2.yaml` to your custom endpoint
> 4. Edit manually where you are want to adding endpoint
> 5. configure `docusaurus.config` then edit line 
`specPath: "your-endpoint-custom.yaml"`
> 6. generate doc using this [command](#command-for-generate-docs-from-yaml)
> 7. Copy file on `docs/whatspie` to `examples/yaml-theme-2/mdx` for backup
> 8. clean up the docs
> 9. follow up [step](#2-template-2) 1-4

-----------------------------------------------------------------------------------------------------------------

# How to update content on docs?
> each template has different way to update it
1. template whatspie-v2-theme-1.yaml
- just update `whatspie-v2-theme-1.yaml`
- then `yarn start` / `yarn build`
2. template whatspie-v2-theme-2.yaml
- better first one edit original yaml.
- If in the original template 2 there is no such endpoint you searching for, check a file on `examples/yaml-theme-2/`

-----------------------------------------------------------------------------------------------------------------

# Note
> if you generate back docs and  using Template 2, Some files will not be generated.
> the files:
> - sending-button-message.api.mdx
> - sending-file-message.api.mdx
> - sending-image-message.api.mdx
> - sending-list-message.api.mdx
> - sending-location-message.api.mdx
> - sending-template-message.api.mdx
> - whatspie-send-text.yaml
> - docs/whatspie/assets/img/whatspie-main-logo.png 
-----------------------------------------------------------------------------------------------------------------
> After using command generate docs
> Copy from `examples/yaml-theme-2/mdx` and paste to `docs/whatspie`, then copy the logo and paste it.
> After done. you can edit manually by using `React Component` or `Markdown`
