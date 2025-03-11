"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Mock database state (in a real app, this would be in a database)
// This is just for demonstration purposes
let presaleState = {
  isReleased: true,
  isPaused: false,
  // other presale state properties would go here
}

// Verify admin authentication
async function verifyAdmin() {
  const adminPassword = process.env.ADMIN_PASSWORD
  const storedPassword = cookies().get("admin_auth")?.value

  if (!adminPassword || storedPassword !== adminPassword) {
    redirect("/admin/login")
  }

  return true
}

// Get current presale state
export async function getPresaleState() {
  await verifyAdmin()
  return { ...presaleState }
}

// Force reset presale state
export async function forceResetPresaleState() {
  try {
    await verifyAdmin()

    // Specifically reverse isReleased and isPaused
    presaleState = {
      ...presaleState,
      isReleased: false, // Set to false (from true)
      isPaused: true, // Set to true (from false)
      // Reset other properties as needed
    }

    console.log("Presale state after reset:", presaleState)

    // Revalidate the paths to reflect changes
    revalidatePath("/")
    revalidatePath("/admin")

    return {
      success: true,
      message: "Presale state has been reset. isReleased is now false and isPaused is now true.",
    }
  } catch (error) {
    console.error("Error in forceResetPresaleState:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reset presale state",
    }
  }
}

// Release token
export async function releaseToken() {
  try {
    await verifyAdmin()

    // Set isReleased to true and isPaused to false
    presaleState = {
      ...presaleState,
      isReleased: true,
      isPaused: false,
    }

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin")

    return {
      success: true,
      message: "Token has been released successfully!",
    }
  } catch (error) {
    console.error("Error in releaseToken:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to release token",
    }
  }
}

// Pause/unpause presale
export async function togglePauseState() {
  try {
    await verifyAdmin()

    // Toggle the isPaused state
    presaleState = {
      ...presaleState,
      isPaused: !presaleState.isPaused,
    }

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin")

    return {
      success: true,
      message: presaleState.isPaused ? "Presale has been paused." : "Presale has been unpaused.",
      isPaused: presaleState.isPaused,
    }
  } catch (error) {
    console.error("Error in togglePauseState:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle pause state",
    }
  }
}

// Remove liquidity with percentage option
export async function removeLiquidity(formData: FormData) {
  try {
    await verifyAdmin()

    const percentage = Number(formData.get("percentage"))

    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      return {
        success: false,
        error: "Invalid percentage. Please enter a value between 1 and 100.",
      }
    }

    // Logic to remove the specified percentage of liquidity
    // This would typically involve blockchain transactions

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin")

    return {
      success: true,
      message: `Successfully removed ${percentage}% of liquidity.`,
    }
  } catch (error) {
    console.error("Error in removeLiquidity:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove liquidity",
    }
  }
}

// Launch token with Telegram CTO creation
export async function launchToken(formData: FormData) {
  try {
    await verifyAdmin()

    const contractAddress = formData.get("contractAddress") as string
    const tokenName = formData.get("tokenName") as string
    const tokenSymbol = formData.get("tokenSymbol") as string

    if (!contractAddress || !tokenName || !tokenSymbol) {
      return {
        success: false,
        error: "Missing required fields. Please provide contract address, token name, and symbol.",
      }
    }

    // Logic to launch the token
    // This would typically involve blockchain transactions

    // Create Telegram CTO (Call to Owner) announcement
    const telegramLink = await createTelegramCTO(contractAddress, tokenName, tokenSymbol)

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin")

    return {
      success: true,
      message: "Token launched successfully!",
      telegramLink,
    }
  } catch (error) {
    console.error("Error in launchToken:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to launch token",
    }
  }
}

// Helper function to create Telegram CTO
async function createTelegramCTO(contractAddress: string, tokenName: string, tokenSymbol: string) {
  // In a real implementation, this would use Telegram's API to create a channel or post
  // For demonstration, we'll just return a simulated link

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return simulated Telegram link
  return `https://t.me/${tokenSymbol.toLowerCase()}_official`
}

