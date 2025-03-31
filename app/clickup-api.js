export {clickupApi as default, clickupApi, ClickupApi};

/**
 * Creates instance of ClickupApi
 * @date 1/21/2024 - 9:32:45 PM
 * @author @almaceleste https://almaceleste.github.io
 *
 * @class ClickupApi
 * @typedef {ClickupApi}
 */
class ClickupApi {
  #apiUrl = 'https://api.clickup.com/api/v2';
  #authorization = undefined;
  #team = '9012059848';
  /**
   * @author @almaceleste https://almaceleste.github.io
   * @type {clickupApiOptions}
   */
  #options = {
    authorization: this.#authorization,
    team: this.#team,
  };
  #webhook = {
    endpoint: undefined,
    events: undefined,
    space_id: undefined,
    folder_id: undefined,
    list_id: undefined,
    task_id: undefined,
  };
  /**
   * Set ClickUp secrets
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {object} secrets
   */
  set secrets({clickupTeam, clickupToken}) {
    this.#authorization = clickupToken;
    this.#team = clickupTeam;
  }

  /**
   * Connects to the network resource
   * @date 1/23/2024 - 12:30:11 AM
   * @author @almaceleste https://almaceleste.github.io
   * @param {string} url - network resource url
   * @param {fetchOptions} [options] - request options
   * @return {Promise<object>}
   */
  #fetch = (url, options) => new Promise(async (resolve, reject) => {
    const response = await fetch(url, options)
        .catch((reason) => reject(reason));
    const data = await response.json();
    resolve(data);
  });
  /**
   * Create webhook
   * @author @almaceleste https://almaceleste.github.io
   * @link https://clickup.com/api/clickupreference/operation/CreateWebhook
   * @param {webhookCreate} webhook - webhook options
   * @return {Promise<responseWebhook>}
   */
  createWebhook = (webhook) => {
    const url = `${this.#apiUrl}/team/${this.#team}/webhook`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.#authorization,
      },
      body: JSON.stringify(webhook),
    };
    return this.#fetch(url, options);
  };
  /**
   * Get webhooks
   * @date 1/22/2024 - 9:00:56 PM
   * @author @almaceleste https://almaceleste.github.io
   * @link https://clickup.com/api/clickupreference/operation/GetWebhooks
   * @return {Promise<responseWebhooks>}
   */
  getWebhooks = () => {
    const url = `${this.#apiUrl}/team/${this.#team}/webhook`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'GET',
      headers: {
        'Authorization': this.#authorization,
      },
    };
    return this.#fetch(url, options);
  };
  /**
   * Delete webhook
   * @author @almaceleste https://almaceleste.github.io
   * @link https://clickup.com/api/clickupreference/operation/DeleteWebhook
   * @param {string} webhookId - webhook id
   * @return {Promise<object>}
   */
  deleteWebhook = (webhookId) => {
    const url = `${this.#apiUrl}/webhook/${webhookId}`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'DELETE',
      headers: {
        'Authorization': this.#authorization,
      },
    };
    return this.#fetch(url, options);
  };
  /**
   * Update webhook
   * @author @almaceleste https://almaceleste.github.io
   * @link https://clickup.com/api/clickupreference/operation/UpdateWebhook
   * @param {string} webhookId - webhook id
   * @param {webhookUpdate} webhook - webhook options
   * @return {Promise<responseWebhook>}
   */
  updateWebhook = (webhookId, webhook) => {
    const url = `${this.#apiUrl}/webhook/${webhookId}`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.#authorization,
      },
      body: JSON.stringify(webhook),
    };
    return this.#fetch(url, options);
  };
  /**
   * Create task
   * @author @almaceleste https://almaceleste.github.io
   * @link https://clickup.com/api/clickupreference/operation/CreateTask
   * @param {string} listId - list id to create new task
   * @param {taskCreate} task
   * @return {Promise<responseTask>}
   */
  createTask = (listId, task) => {
    const url = `${this.#apiUrl}/list/${listId}/task`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.#authorization,
      },
      body: JSON.stringify(task),
    };
    return this.#fetch(url, options);
  };
  /**
   * Create task attachment
   * @author @almaceleste https://almaceleste.github.io
   * @link https://clickup.com/api/clickupreference/operation/CreateTaskAttachment
   * @param {string} taskId - task id to post attachment
   * @param {object} file - file options
   * @param {Blob} file.blob - file content as blob
   * @param {string} file.filename - file name
   * @return {Promise<responseCreateAttachment>}
   */
  createTaskAttachment = (taskId, file) => {
    const url = `${this.#apiUrl}/task/${taskId}/attachment`;
    const data = new FormData();
    data.append('attachment', file.blob, file.filename);
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'POST',
      headers: {
        'Authorization': this.#authorization,
      },
      body: data,
    };
    return this.#fetch(url, options);
  };
  /**
   * Create task comment
   * @author @almaceleste https://almaceleste.github.io
   * @link https://clickup.com/api/clickupreference/operation/CreateTaskComment
   * @param {string} taskId - task id to post comment
   * @param {object} comment - comment options
   * @param {string} comment.comment_text
   * @param {number} [comment.assignee]
   * @param {boolean} [comment.notify_all]
   * @return {Promise<responseCreateComment>}
   */
  createTaskComment = (taskId, comment) => {
    const url = `${this.#apiUrl}/task/${taskId}/comment`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.#authorization,
      },
      body: JSON.stringify(comment),
    };
    return this.#fetch(url, options);
  };
  /**
   * Get list fields
   * @author @almaceleste https://almaceleste.github.io
   * @link https://clickup.com/api/clickupreference/operation/GetAccessibleCustomFields
   * @param {string} listId - list id to get information
   * @return {Promise<responseFields>}
   */
  getFields = (listId) => {
    const url = `${this.#apiUrl}/list/${listId}/field`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.#authorization,
      },
    };
    return this.#fetch(url, options);
  };
  /**
   * Get list info
   * @author @almaceleste https://almaceleste.github.io
   * @link https://clickup.com/api/clickupreference/operation/GetList
   * @param {string} listId - list id to get information
   * @return {Promise<responseList>}
   */
  getList = (listId) => {
    const url = `${this.#apiUrl}/list/${listId}`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.#authorization,
      },
    };
    return this.#fetch(url, options);
  };
  /**
   * Get task info
   * @author @almaceleste https://almaceleste.github.io
   * @link https://clickup.com/api/clickupreference/operation/GetTask
   * @param {string} taskId - task id to get information
   * @return {Promise<responseTask>}
   */
  getTask = (taskId) => {
    const url = `${this.#apiUrl}/task/${taskId}`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.#authorization,
      },
    };
    return this.#fetch(url, options);
  };
  /**
   * Update task
   * @author @almaceleste https://almaceleste.github.io
   * @link https://clickup.com/api/clickupreference/operation/UpdateTask
   * @param {string} taskId - task id to update
   * @param {taskUpdate} task - task options
   * @return {Promise<responseTask>}
   */
  updateTask = (taskId, task) => {
    const url = `${this.#apiUrl}/task/${taskId}`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.#authorization,
      },
      body: task,
    };
    return this.#fetch(url, options);
  };

  /**
   * Creates an instance of ClickupApi.
   * @date 1/22/2024 - 8:48:04 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @constructor
   * @param {clickupApiOptions} [options]
   */
  constructor(options = this.#options) {
    this.#authorization = options.authorization;
    this.#team = options.team;
  }
}

const clickupApi = new ClickupApi();

/**
 * @author @almaceleste https://almaceleste.github.io
 * @typedef {object} clickupApiOptions
 * @property {string} authorization
 * @property {string} team
 */
/**
 * @author @almaceleste https://almaceleste.github.io
 * @typedef {object} fetchOptions
 * @property {Blob|ArrayBuffer|DataView|FormData|URLSearchParams|
 * string|ReadableStream} [body] - body object
 * @property {'default'|'no-store'|'reload'|'no-cache'|
 * 'force-cache'|'only-if-cached'} [cache] - cache mode to use for the request
 * @property {'omit'|'same-origin'|'include'} [credentials] - sent
 * credentials with the request always, never, or only to a same-origin URL
 * @property {object} [headers] - request headers
 * @property {boolean} [integrity] - sub-resource integrity value of
 * the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=)
 * @property {boolean} [keepalive] - indicates whether to make
 * a persistent connection for multiple requests/responses
 * @property {'GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'CONNECT'|
 * 'OPTIONS'|'TRACE'} [method] - request method; default is 'GET'
 * @property {'cors'|'no-cors'|'same-origin'} [mode] - mode to use
 * for the request, e.g., cors, no-cors, or same-origin.
 * @property {'high'|'low'|'auto'} [priority] - specifies the
 * priority of the fetch request relative to other requests of the same type
 * @property {'follow'|'error'|'manual'} [redirect] - redirect mode
 * to use in request; indicates whether request follows redirects,
 * results in an error upon encountering a redirect, or
 * returns the redirect (in an opaque fashion); default is 'follow'
 * @property {'no-referrer'|'client'|URL} [referrer] - string whose
 * value is a same-origin URL, "about:client", or the empty string,
 * to set request's referrer
 * @property {'no-referrer'|'no-referrer-when-downgrade'|
 * 'same-origin'|'origin'|'strict-origin'|
 * 'origin-when-cross-origin'|'strict-origin-when-cross-origin'|
 * 'unsafe-url'} [referrerPolicy] - string that changes how the
 * referrer header is populated during certain actions (e.g.,
 * fetching sub-resources, prefetching, performing navigation)
 * @property {AbortSignal} [signal] - an AbortSignal object which
 * can be used to communicate with/abort a request
 * @property {null} [window] - can only be null; used to
 * disassociate request from any window
 */
/**
 * @author @almaceleste https://almaceleste.github.io
 * @typedef {object} attachment
 * @property {string} id
 * @property {string} date
 * @property {string} title
 * @property {number} type
 * @property {number} source
 * @property {number} version
 * @property {string} extension
 * @property {string} thumbnail_small - url
 * @property {string} thumbnail_medium - url
 * @property {string} thumbnail_large - url
 * @property {true|null} is_folder
 * @property {string} mimetype
 * @property {boolean} hidden
 * @property {string} parent_id
 * @property {number} size
 * @property {number} total_comments
 * @property {number} resolved_comments
 * @property {user} user
 * @property {boolean} deleted
 * @property {string} orientation
 * @property {string} url
 * @property {any} email_data
 * @property {string} url_w_query
 * @property {string} url_w_host
 * @property {number} [parent_comment_type]
 * @property {string} [parent_comment_parent]
 *
 * @typedef {object} commentItem
 * @property {string} id
 * @property {string} date
 * @property {string} parent
 * @property {number} type
 * @property {commentLine[]} comment
 * @property {string} text_content
 * @property {number} x
 * @property {number} y
 * @property {number} image_x
 * @property {number} image_y
 * @property {number} page
 * @property {number} comment_number
 * @property {string} comment_time
 * @property {string} referenced_content
 * @property {versionVector} _version_vector
 * @property {number} comment_type
 * @property {number} page_id
 * @property {string} page_name
 * @property {string} view_id
 * @property {string} view_name
 * @property {string} team
 * @property {string} view_parent_id
 * @property {user} user
 * @property {number} new_thread_count
 * @property {number} new_mentioned_thread_count
 * @property {Array} email_attachments
 * @property {user[]} threaded_users
 * @property {number} threaded_replies
 * @property {number} threaded_assignees
 * @property {user[]} threaded_assignees_members
 * @property {number} threaded_unresolved_count
 * @property {user[]} thread_followers
 * @property {user[]} group_thread_followers
 * @property {Array} reactions
 * @property {Array} emails
 *
 * @typedef {object} commentLine
 * @property {string} text
 * @property {'attachment'} [type]
 * @property {{'block-id': string}} [attributes]
 * @property {attachment} [attachment]
 *
 * @typedef {object} creator
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} color
 * @property {string} profilePicture
 *
 * @typedef {object} customField
 * @property {string} id
 * @property {string} name
 * @property {typeField} type
 * @property {typeConfig} type_config
 * @property {string} date_created
 * @property {string} hide_from_guests
 * @property {{value: string}} [value]
 * @property {boolean} required
 *
 * @typedef {'taskCreated'|'taskUpdated'|'taskDeleted'|
 * 'taskPriorityUpdated'|'taskStatusUpdated'|'taskAssigneeUpdated'|
 * 'taskDueDateUpdated'|'taskTagUpdated'|'taskMoved'|
 * 'taskCommentPosted'|'taskCommentUpdated'|
 * 'taskTimeEstimateUpdated'|'taskTimeTrackedUpdated'|'listCreated'|
 * 'listUpdated'|'listDeleted'|'folderCreated'|'folderUpdated'|
 * 'folderDeleted'|'spaceCreated'|'spaceUpdated'|'spaceDeleted'|
 * 'goalCreated'|'goalUpdated'|'goalDeleted'|'keyResultCreated'|
 * 'keyResultUpdated'|'keyResultDeleted'} eventType
 *
 * @typedef {object} folder
 * @property {string} id
 * @property {string} name
 * @property {boolean} hidden
 * @property {boolean} access
 *
 * @typedef {object} historyItem
 * @property {string} id
 * @property {number} type
 * @property {string} date - The date and time when the event
 * ocurred, displayed in Unix time in milliseconds.
 * @property {string} field - The field on the task that triggered
 * the webhook.
 * @property {string} parent_id
 * @property {object} data
 * @property {object} source
 * @property {user} user - The user who performed the action that
 * triggered the webhook.
 * @property {string} before - The state of the task before the
 * change that triggered the webhook.
 * @property {string} after - The state of the task after the
 * change that triggered the webhook.
 * @property {commentItem} [comment]
 *
 * @typedef {object} list
 * @property {string} id
 * @property {string} name
 * @property {boolean} access
 *
 * @typedef {'attachment'|'comment'|'list'|'task'} objectType
 *
 * @typedef {object} payload
 * @property {eventType} event
 * @property {historyItem[]} [history_items]
 * @property {string} task_id
 * @property {string} webhook_id
 *
 * @typedef {object} project
 * @property {string} id
 * @property {string} name
 * @property {boolean} hidden
 * @property {boolean} access
 *
 * @typedef {'assignees'|'priority'|'due_date'|'content'|'comments'|
 * 'attachments'|'customFields'|'subtasks'|'tags'|'checklists'|
 * 'coverimage'} publicField
 *
 * @typedef {object} relationship
 * @property {'comment-parent'} type
 * @property {objectType} object_type
 * @property {string} object_id
 * @property {string} workspace_id
 *
 * @typedef {object} responseCreateAttachment
 * @property {string} id
 * @property {string} version
 * @property {number} date
 * @property {string} name
 * @property {string} title
 * @property {string} extension
 * @property {string} thumbnail_small - url to the small attachment thumbnail
 * @property {string} thumbnail_medium - url to the medium attachment thumbnail
 * @property {string} thumbnail_large - url to the large attachment thumbnail
 * @property {string} url - url to the attachment
 * @property {string} url_w_query
 * @property {string} url_w_host
 *
 * @typedef {object} responseCreateComment
 * @property {string} id
 * @property {string} hist_id
 * @property {number} date
 * @property {version} version
 *
 * @typedef {object} responseFields
 * @property {customField[]} fields
 *
 * @typedef {object} responseList
 * @property {string} id
 * @property {string} name
 * @property {number} orderindex
 * @property {string} content
 * @property {statusList} [status] - not a status actually, just a
 * color of the list
 * @property {{priority: string, color: string}} priority
 * @property {user} assignee
 * @property {number} due_date
 * @property {boolean} due_date_time
 * @property {number} start_date
 * @property {boolean} start_date_time
 * @property {folder} folder
 * @property {space} space
 * @property {string} inbound_address
 * @property {boolean} archived
 * @property {boolean} override_statuses
 * @property {statusTask[]} statuses
 * @property {string} permission_level
 *
 * @typedef {object} responseTask
 * @property {string} id
 * @property {string} custom_id
 * @property {string} custom_item_id
 * @property {string} name
 * @property {string} text_content
 * @property {string} description
 * @property {string} [markdown_description]
 * @property {statusTask} status
 * @property {string} orderindex
 * @property {string} date_created
 * @property {string} date_updated
 * @property {string} date_closed
 * @property {string} date_done
 * @property {boolean} archived
 * @property {creator} creator
 * @property {user[]} assignees
 * @property {user[]} watchers
 * @property {number[]} checklists
 * @property {tag[]} tags
 * @property {string} parent
 * @property {number} priority
 * @property {number} due_date
 * @property {number} start_date
 * @property {number} points
 * @property {number} time_estimate
 * @property {number} time_spent
 * @property {customField[]} custom_fields
 * @property {Array} dependencies
 * @property {Array} linked_tasks
 * @property {Array} locations
 * @property {string} team_id
 * @property {string} url
 * @property {sharing} sharing
 * @property {string} permission_level
 * @property {list} list
 * @property {project} project
 * @property {folder} folder
 * @property {{id: string}} space
 * @property {attachment[]} [attachments]
 *
 * @typedef {object} responseWebhook
 * @property {string} id
 * @property {webhook} webhook
 *
 * @typedef {object} responseWebhooks
 * @property {webhook[]} webhooks
 *
 * @typedef {object} sharing
 * @property {boolean} public
 * @property {number} public_share_expires_on
 * @property {publicField[]} public_fields
 * @property {string} token
 * @property {boolean} seo_optimized
 *
 * @typedef {object} space
 * @property {string} id
 * @property {string} name
 * @property {boolean} access
 *
 * @typedef {object} statusList
 * @property {'green'|'red'|'yellow'} status
 * @property {'#008844'|'#d33d44'|'#f8ae00'} color
 * @property {true} hide_label
 *
 * @typedef {object} statusTask
 * @property {string} id
 * @property {string} status
 * @property {string} color
 * @property {string} orderindex
 * @property {'closed'|'custom'|'done'|'open'} type
 *
 * @typedef {object} tag
 * @property {string} name
 * @property {string} tag_fg
 * @property {string} tag_bg
 * @property {number} creator
 *
 * @typedef {object} taskCreate
 * @property {string} name
 * @property {string} [description]
 * @property {number[]} [assignees]
 * @property {string[]} [tags]
 * @property {string} [status]
 * @property {number} [priority]
 * @property {number} [due_date]
 * @property {boolean} [due_date_time]
 * @property {number} [time_estimate]
 * @property {number} [start_date]
 * @property {boolean} [start_date_time]
 * @property {boolean} [notify_all] - If `notify_all` is `true`,
 * notifications will be sent to everyone including the creator of the comment.
 * @property {string} [parent] - You can create a subtask by
 * including an existing task ID.
 * The `parent` task ID you include cannot be a subtask, and must be
 * in the same List specified in the path parameter.
 * @property {string} [links_to] - Include a task ID to create a
 * linked dependency with your new task.
 * @property {boolean} [check_required_custom_fields] - When
 * creating a task via API any required Custom Fields are ignored
 * by default (`false`).
 * You can enforce required Custom Fields by including
 * `check_required_custom_fields: true`.
 * @property {{id: string, value: string}[]} [custom_fields]
 * @property {1|2|null} [custom_item_id] - To create a task that
 * doesn't use a custom task type, either don't include this field
 * in the request body, or send `null`.
 * To create this task as a Milestone, send a value of `1`.
 * To use a custom task type, send the custom task type ID as
 * defined in your Workspace, such as `2`.
 *
 * @typedef {object} taskUpdate
 * @property {string} [name]
 * @property {string} [description] - To clear the task
 * description, include `description` with `' '`.
 * @property {{add: number[], rem: number[]}} [assignees]
 * @property {string} [status]
 * @property {number} [priority]
 * @property {number} [due_date]
 * @property {boolean} [due_date_time]
 * @property {number} [time_estimate]
 * @property {number} [start_date]
 * @property {boolean} [start_date_time]
 * @property {boolean} [archived]
 * @property {string} [parent] - You can create a subtask by
 * including an existing task ID.
 * The `parent` task ID you include cannot be a subtask, and must be
 * in the same List specified in the path parameter.
 * @property {1|2|null} [custom_item_id] - To convert an item using
 * a custom task type into a task, send `null`.
 * To update this task to be a Milestone, send a value of `1`.
 * To use a custom task type, send the custom task type ID as
 * defined in your Workspace, such as `2`.
 *
 * @typedef {object} typeConfig
 * @property {Array} fields
 * @property {string} subcategory_id
 * @property {boolean} linked_subcategory_access
 * @property {string} subcategory_inverted_name
 * @property {typeConfigOption[]} options
 *
 * @typedef {object} typeConfigOption
 * @property {string} id
 * @property {string} label
 * @property {string} color
 *
 * @typedef {'checkbox'|'email'|'labels'|'list_relationship'|
 * 'short_text'} typeField
 *
 * @typedef {object} user
 * @property {number} id
 * @property {string} username
 * @property {string} color
 * @property {string} initials
 * @property {string} email
 * @property {string} profilePicture
 *
 * @typedef {object} vector
 * @property {number} master_id
 * @property {number} version
 * @property {boolean} deleted
 *
 * @typedef {object} version
 * @property {objectType} object_type
 * @property {string} object_id
 * @property {number} workspace_id
 * @property {'c'} operation
 * @property {number} master_id
 * @property {number} version
 * @property {boolean} deleted
 * @property {string} traceparent
 * @property {number} date_created
 * @property {number} date_updated
 * @property {number} event_publish_time
 * @property {{context: object, relationships: relationship[]}} data
 *
 * @typedef {object} versionVector
 * @property {number} workspace_id
 * @property {objectType} object_type
 * @property {string} object_id
 * @property {vector[]} vector
 *
 * @typedef {object} webhook
 * @property {string} id
 * @property {number} userid
 * @property {number} team_id
 * @property {string} endpoint
 * @property {string} client_id
 * @property {eventType[]} events
 * @property {string|null} task_id
 * @property {string|null} list_id
 * @property {string|null} folder_id
 * @property {string|null} space_id
 * @property {string} secret
 * @property {object} health
 * @property {string} health.status
 * @property {number} health.fail_count
 *
 * @typedef {object} webhookCreate
 * @property {string} endpoint - webhook url
 * @property {eventType[]} events - webhook events
 * @property {number} [space_id] - space id
 * @property {number} [folder_id] - folder id
 * @property {number} [list_id] - list id
 * @property {string} [task_id] - task id
 *
 * @typedef {object} webhookUpdate
 * @property {string} endpoint - webhook url
 * @property {eventType[]} events - webhook events
 * @property {string} status - webhook status
 *
 */
