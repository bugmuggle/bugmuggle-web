# Bugmuggle
BugMuggle is a free desktop tool designed to help small and medium-sized engineering teams streamline their communication and work together efficiently on project tasks.

## Pre-requisites
BugMuggle leverages [Tauri](https://v2.tauri.app/), a cross-platform toolkit that enables desktop app creation with web technologies. The application relies on [Pocketbase](https://pocketbase.io/) for its backend functionality. Before beginning development, ensure you have installed and launched Pocketbase.

## Development Setup
1. Download pocketbase by following this [link](https://pocketbase.io/docs/)
2. Extract the downloaded file and store it somewhere in your system.
3. Run the following command to start pocketbase locally on your computer.
``` bash
./pocketbase serve
```
> To resolve the macOS security block when running the pocketbase server, execute this command in your terminal: `xattr -d com.apple.quarantine ./pocketbase`. This removes the quarantine flag, allowing macOS to run the pocketbase executable without developer verification warnings.
4. Clone the bugmuggle repository and install dependencies using `pnpm`.
5. Start the development using following command:
``` bash
pnpm tauri dev
```
