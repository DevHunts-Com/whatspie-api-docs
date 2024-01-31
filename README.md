# Whatspie Api Documentation

## Table of Contents

## Requirements

- Yarn >= 1.22.19

## Installation

- Clone whatspie doc
- `yarn install`
- `yarn start`

## Usage For Development 

### Command for generate docs from .yaml
- `yarn docusaurus gen-api-docs whatspie`
### Command for clear docs
- `yarn docusaurus clean-api-docs whatspie`

### Note
> if you generate back docs using command, Some files will not be generated.
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
> Copy from `examples/yaml-per-parth/messages/mdx` and paste to `docs/whatspie`, then copy the logo and paste it.
> After done. you can edit manually by using `React Component` or `Markdown`
