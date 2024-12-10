const db = require("../config/db");

// Post a new campaign
exports.postCampaign = async (req, res) => {
  const { title, description, businessName } = req.body;
  const userId = req.user.userId; // Assuming user ID is extracted from JWT

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required." });
  }

  try {
    const [result] = await db.query("INSERT INTO campaigns (title, description, business_name, creator_id, status) VALUES (?, ?, ?, ?, ?)", [
      title,
      description,
      businessName || null,
      userId,
      "pending",
    ]);
    res.status(201).json({ message: "Campaign submitted successfully.", campaignId: result.insertId });
  } catch (error) {
    console.error("Error posting campaign:", error);
    res.status(500).json({ error: "Failed to submit the campaign." });
  }
};

// Approve a campaign (admin only)
exports.approveCampaign = async (req, res) => {
  const campaignId = req.params.id;

  try {
    const [result] = await db.query("UPDATE campaigns SET status = ? WHERE campaign_id = ?", ["approved", campaignId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    res.status(200).json({ message: "Campaign approved successfully." });
  } catch (error) {
    console.error("Error approving campaign:", error);
    res.status(500).json({ error: "Failed to approve the campaign." });
  }
};

// Get all pending campaigns (admin view)
exports.getPendingCampaigns = async (req, res) => {
  try {
    const [campaigns] = await db.query("SELECT * FROM campaigns WHERE status = ?", ["pending"]);
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching pending campaigns:", error);
    res.status(500).json({ error: "Failed to fetch pending campaigns." });
  }
};

// Fetch all approved campaigns
exports.getApprovedCampaigns = async (req, res) => {
  try {
    const [campaigns] = await db.query("SELECT * FROM campaigns WHERE status = ?", ["approved"]);
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching approved campaigns:", error);
    res.status(500).json({ error: "Failed to fetch approved campaigns." });
  }
};

// Fetch campaign details by ID
exports.getCampaignDetails = async (req, res) => {
  const campaignId = req.params.id;

  try {
    const [campaign] = await db.query("SELECT * FROM campaigns WHERE campaign_id = ?", [campaignId]);

    if (campaign.length === 0) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    res.status(200).json(campaign[0]);
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    res.status(500).json({ error: "Failed to fetch campaign details." });
  }
};
// Update campaign details
exports.updateCampaign = async (req, res) => {
  const campaignId = req.params.id;
  const { title, description, businessName, status } = req.body;

  try {
    const [result] = await db.query("UPDATE campaigns SET title = ?, description = ?, business_name = ?, status = ? WHERE campaign_id = ?", [
      title,
      description,
      businessName || null,
      status,
      campaignId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    res.status(200).json({ message: "Campaign updated successfully." });
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(500).json({ error: "Failed to update the campaign." });
  }
};

// Delete campaign
exports.deleteCampaign = async (req, res) => {
  const campaignId = req.params.id;

  try {
    const [result] = await db.query("DELETE FROM campaigns WHERE campaign_id = ?", [campaignId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    res.status(200).json({ message: "Campaign deleted successfully." });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ error: "Failed to delete the campaign." });
  }
};
// Participate in a campaign
exports.participateInCampaign = async (req, res) => {
  const campaignId = req.params.id;
  const userId = req.user.userId; // Extracted from JWT middleware

  try {
    // Check if the user has already participated
    const [existingParticipation] = await db.query("SELECT * FROM participation WHERE user_id = ? AND campaign_id = ?", [userId, campaignId]);

    if (existingParticipation.length > 0) {
      return res.status(400).json({ error: "User has already participated in this campaign." });
    }

    // Insert participation record
    await db.query("INSERT INTO participation (user_id, campaign_id) VALUES (?, ?)", [userId, campaignId]);

    res.status(201).json({ message: "Participation recorded successfully." });
  } catch (error) {
    console.error("Error participating in campaign:", error);
    res.status(500).json({ error: "Failed to participate in the campaign." });
  }
};
// Check if the user has participated in a specific campaign
exports.checkParticipation = async (req, res) => {
  const campaignId = req.params.id;
  const userId = req.user.userId; // Extracted from JWT middleware

  try {
    const [participation] = await db.query("SELECT * FROM participation WHERE user_id = ? AND campaign_id = ?", [userId, campaignId]);

    if (participation.length > 0) {
      return res.status(200).json({ participated: true });
    }

    res.status(200).json({ participated: false });
  } catch (error) {
    console.error("Error checking participation:", error);
    res.status(500).json({ error: "Failed to check participation status." });
  }
};
