# Kirbot

A simple utility Discord bot

- Invite Link (Kirbot)
  - https://discord.com/api/oauth2/authorize?client_id=668262310137298989&permissions=268435456&scope=applications.commands%20bot
- Invite Link (KirbotDev)
  - https://discord.com/api/oauth2/authorize?client_id=668263019955879986&permissions=268435456&scope=applications.commands%20bot

## Slash Commands

The following should be enough permissions:
 - Manage Roles

This all together is **268435456** in permission bit flags

### Registering update commands

Right now the best way is to shell into the bot and run the npm command from in there:

```sh
$> docker-compose run bot sh
(bot) $> npm run deployCommands
```

This is only necessary when command configs are added, updated, removed, etc... Changes to the handlers don't require this step.
