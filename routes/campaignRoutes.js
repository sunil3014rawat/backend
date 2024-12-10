const express = require("express");
const {
  postCampaign,
  approveCampaign,
  getPendingCampaigns,
  getApprovedCampaigns,
  getCampaignDetails,
  updateCampaign,
  deleteCampaign,
  participateInCampaign,
  checkParticipation,
} = require("../controllers/campaignController");
const { authenticateToken, authorizeAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// Route to post a campaign
router.post("/", authenticateToken, postCampaign);

// Route for admin to approve a campaign
router.put("/:id/approve", authenticateToken, authorizeAdmin, approveCampaign);

// Route to get pending campaigns (admin view)
router.get("/pending", authenticateToken, authorizeAdmin, getPendingCampaigns);

// Route to update a campaign (admin only)
router.put("/:id", authenticateToken, authorizeAdmin, updateCampaign);

// Route to delete a campaign (admin only)
router.delete("/:id", authenticateToken, authorizeAdmin, deleteCampaign);

// Route to participate in a campaign
router.post("/:id/participate", authenticateToken, participateInCampaign);

// Route to check participation status
router.get("/:id/participation-status", authenticateToken, checkParticipation);

// Route to get all approved campaigns
router.get("/approved", getApprovedCampaigns);

// Route to get campaign details by ID
router.get("/:id", getCampaignDetails);

module.exports = router;
