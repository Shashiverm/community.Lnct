import Event from "../models/Event.js"
import Notification from "../models/Notification.js"

// @desc    Get all events
// @route   GET /api/events
// @access  Private
export const getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, upcoming = "true", search } = req.query

    // Build query
    const query = { isCancelled: false }

    if (category) {
      query.category = category
    }

    // Filter by date
    const currentDate = new Date()
    if (upcoming === "true") {
      query.date = { $gte: currentDate }
    } else if (upcoming === "false") {
      query.date = { $lt: currentDate }
    }

    // Search by title or description
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const events = await Event.find(query)
      .populate("organizer", "name role profileImage")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ date: 1 })

    // Add attending status for current user
    const eventsWithAttendingStatus = events.map((event) => {
      const userAttendance = event.attendees.find((attendee) => attendee.user.toString() === req.user.id)

      const eventObj = event.toObject()
      eventObj.isAttending = userAttendance ? userAttendance.status : null

      return eventObj
    })

    const total = await Event.countDocuments(query)

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
      data: eventsWithAttendingStatus,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res, next) => {
  try {
    req.body.organizer = req.user.id

    const event = await Event.create(req.body)

    // Populate organizer details
    await event.populate("organizer", "name role profileImage")

    res.status(201).json({
      success: true,
      data: event,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name role profileImage")
      .populate("attendees.user", "name role profileImage")

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Check if user has access to this event
    if (!event.isPublic && event.organizer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this event",
      })
    }

    // Add attending status for current user
    const userAttendance = event.attendees.find((attendee) => attendee.user._id.toString() === req.user.id)

    const eventObj = event.toObject()
    eventObj.isAttending = userAttendance ? userAttendance.status : null

    res.status(200).json({
      success: true,
      data: eventObj,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Make sure user is event organizer
    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event",
      })
    }

    // Fields to update
    const fieldsToUpdate = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      endDate: req.body.endDate,
      location: req.body.location,
      category: req.body.category,
      image: req.body.image,
      isPublic: req.body.isPublic,
      maxAttendees: req.body.maxAttendees,
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach((key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key])

    event = await Event.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate("organizer", "name role profileImage")

    // Notify attendees about the update
    const attendeeIds = event.attendees.map((attendee) => attendee.user)

    if (attendeeIds.length > 0) {
      const notifications = attendeeIds.map((userId) => ({
        recipient: userId,
        sender: req.user.id,
        type: "event",
        content: `Event "${event.title}" has been updated`,
        relatedId: event._id,
        onModel: "Event",
      }))

      await Notification.insertMany(notifications)
    }

    res.status(200).json({
      success: true,
      data: event,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Make sure user is event organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event",
      })
    }

    await event.remove()

    // Notify attendees about the cancellation
    const attendeeIds = event.attendees.map((attendee) => attendee.user)

    if (attendeeIds.length > 0) {
      const notifications = attendeeIds.map((userId) => ({
        recipient: userId,
        sender: req.user.id,
        type: "event",
        content: `Event "${event.title}" has been cancelled`,
        relatedId: event._id,
        onModel: "Event",
      }))

      await Notification.insertMany(notifications)
    }

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Attend event
// @route   POST /api/events/:id/attend
// @access  Private
export const attendEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Check if event is cancelled
    if (event.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Cannot attend a cancelled event",
      })
    }

    // Check if event date has passed
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot attend a past event",
      })
    }

    // Check if max attendees limit is reached
    if (event.maxAttendees && event.attendees.filter((a) => a.status === "attending").length >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: "Event has reached maximum attendees limit",
      })
    }

    // Check if user is already attending
    const existingAttendee = event.attendees.find((attendee) => attendee.user.toString() === req.user.id)

    if (existingAttendee) {
      // Update status
      existingAttendee.status = req.body.status || "attending"
    } else {
      // Add user to attendees
      event.attendees.push({
        user: req.user.id,
        status: req.body.status || "attending",
      })
    }

    await event.save()

    // Notify event organizer
    if (event.organizer.toString() !== req.user.id) {
      await Notification.create({
        recipient: event.organizer,
        sender: req.user.id,
        type: "event",
        content: `${req.user.name} is attending your event "${event.title}"`,
        relatedId: event._id,
        onModel: "Event",
      })
    }

    res.status(200).json({
      success: true,
      data: event,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update attendance status
// @route   PUT /api/events/:id/attendance
// @access  Private
export const updateAttendance = async (req, res, next) => {
  try {
    const { status } = req.body

    if (!status || !["attending", "maybe", "not attending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid attendance status",
      })
    }

    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Find attendee
    const attendeeIndex = event.attendees.findIndex((attendee) => attendee.user.toString() === req.user.id)

    if (attendeeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "You are not registered for this event",
      })
    }

    // Update status
    event.attendees[attendeeIndex].status = status
    await event.save()

    res.status(200).json({
      success: true,
      data: event,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get event attendees
// @route   GET /api/events/:id/attendees
// @access  Private
export const getEventAttendees = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "attendees.user",
      "name role department batch profileImage",
    )

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    res.status(200).json({
      success: true,
      count: event.attendees.length,
      data: event.attendees,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel event
// @route   PUT /api/events/:id/cancel
// @access  Private
export const cancelEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Make sure user is event organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this event",
      })
    }

    event.isCancelled = true
    await event.save()

    // Notify attendees about the cancellation
    const attendeeIds = event.attendees.map((attendee) => attendee.user)

    if (attendeeIds.length > 0) {
      const notifications = attendeeIds.map((userId) => ({
        recipient: userId,
        sender: req.user.id,
        type: "event",
        content: `Event "${event.title}" has been cancelled`,
        relatedId: event._id,
        onModel: "Event",
      }))

      await Notification.insertMany(notifications)
    }

    res.status(200).json({
      success: true,
      data: event,
    })
  } catch (error) {
    next(error)
  }
}
