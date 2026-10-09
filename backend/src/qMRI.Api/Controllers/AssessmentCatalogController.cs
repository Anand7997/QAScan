using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qMRI.Application.Assessments.Abstractions;

namespace qMRI.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/assessment-catalog")]
public sealed class AssessmentCatalogController(IAssessmentCatalogService catalogService) : ControllerBase
{
    [HttpGet("tree")]
    public async Task<IActionResult> GetHierarchy(
        [FromQuery] bool includeQuestions = false,
        CancellationToken cancellationToken = default)
    {
        var hierarchy = await catalogService.GetHierarchyAsync(
            includeInactive: false,
            includeQuestions,
            cancellationToken);

        return Ok(hierarchy);
    }
}
