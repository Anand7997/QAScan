using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qMRI.Application.Assessments.Abstractions;
using qMRI.Application.Assessments.DTOs;

namespace qMRI.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/dashboard-governance")]
public sealed class DashboardGovernanceController(IDashboardGovernanceService governanceService) : ControllerBase
{
    [HttpGet("resume-pointer")]
    public async Task<IActionResult> GetResumePointer(CancellationToken cancellationToken)
    {
        var currentUserId = TryGetCurrentUserId();
        return currentUserId is null
            ? Unauthorized()
            : Ok(await governanceService.GetResumePointerAsync(currentUserId.Value, cancellationToken));
    }

    [HttpPut("resume-pointer")]
    public async Task<IActionResult> SaveResumePointer(
        [FromBody] UpsertDashboardResumePointerRequest request,
        CancellationToken cancellationToken)
    {
        var currentUserId = TryGetCurrentUserId();
        return currentUserId is null
            ? Unauthorized()
            : Ok(await governanceService.UpsertResumePointerAsync(currentUserId.Value, request, cancellationToken));
    }

    [HttpDelete("resume-pointer")]
    public async Task<IActionResult> ClearResumePointer(CancellationToken cancellationToken)
    {
        var currentUserId = TryGetCurrentUserId();
        if (currentUserId is null)
        {
            return Unauthorized();
        }

        return await governanceService.ClearResumePointerAsync(currentUserId.Value, cancellationToken)
            ? NoContent()
            : NotFound();
    }

    private Guid? TryGetCurrentUserId()
    {
        var claimValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(claimValue, out var userId) ? userId : null;
    }
}
