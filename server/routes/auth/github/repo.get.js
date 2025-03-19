export default defineOAuthGitHubEventHandler({
  config: {
    // Request repository access scopes
    scopes: ['repo'],
    // Store these tokens separately from the auth tokens
    sessionName: 'github-repo'
  },
  async onSuccess(event, { user, tokens }) {
    const channelId = getQuery(event).channelId
    
    // Store the tokens for this user and channel
    await useDrizzle().insert(tables.githubTokens).values({
      userId: user.id,
      channelId: channelId,
      accessToken: tokens.accessToken,
      createdAt: new Date(),
      updatedAt: new Date()
    }).onConflictDoUpdate({
      target: [tables.githubTokens.userId, tables.githubTokens.channelId],
      set: {
        accessToken: tokens.accessToken,
        updatedAt: new Date()
      }
    })
    
    // Redirect back to the channel page
    return sendRedirect(event, `/channel/${channelId}`)
  },
  // Handle errors
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    const channelId = getQuery(event).channelId
    return sendRedirect(event, `/channel/${channelId}`)
  },
}) 