# Dashboard Deployment Troubleshooting

Common issues and solutions for dashboard building and deployment.

## Build Issues

### Error: "Cannot find module"

**Symptom:** Build fails with module not found errors

**Solutions:**
1. Install dependencies:
   ```bash
   cd dashboard/
   npm install
   ```

2. Clear cache and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Error: TypeScript compilation errors

**Symptom:** Build fails with TS errors in parser or components

**Solutions:**
1. Check TypeScript version matches project requirements:
   ```bash
   npm list typescript
   ```

2. Verify all type definitions are correct in `lib/parser/types.ts`

3. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run build
   ```

### Error: "Port already in use"

**Symptom:** Dev server won't start, port conflict

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## Parser Issues

### Error: "Unable to parse audit file"

**Symptom:** Validation script fails or dashboard shows 0/0 data

**Solutions:**
1. Validate audit file structure:
   ```bash
   node .claude/skills/dashboard-builder/scripts/validate_audit.js output/your-audit.md
   ```

2. Check markdown format matches expected structure:
   - `## STEP 1 RESULTS: Source & Citation Discovery`
   - `## STEP 2 RESULTS: Citation Quality Scoring`
   - `## STEP 3 RESULTS: LLM Response Evaluation`
   - `## STRATEGIC RECOMMENDATIONS`

3. Verify regex patterns in `dashboard/lib/parser/extractors.ts` match your audit format

### Error: Data displays as 0% or blank

**Symptom:** Dashboard loads but shows empty/zero values

**Solutions:**
1. Check parser regex patterns match markdown structure
2. Verify audit file is in `output/` directory (relative to project root)
3. Test parser directly:
   ```bash
   cd dashboard/
   node test-parser.js
   ```

## Vercel Deployment Issues

### Error: "Authentication required"

**Symptom:** `vercel: command not found` or authentication errors

**Solutions:**
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Authenticate:
   ```bash
   vercel login
   ```

### Error: "Build failed" on Vercel

**Symptom:** Deployment starts but build fails on Vercel servers

**Solutions:**
1. Check build works locally first:
   ```bash
   cd dashboard/
   npm run build
   ```

2. Verify `vercel.json` configuration is correct

3. Check Vercel build logs for specific errors (Vercel dashboard → Deployments → Select failed deployment)

4. Ensure all dependencies are in `package.json` (not just dev dependencies)

### Error: "No output directory"

**Symptom:** Build succeeds but deployment fails

**Solution:**
Verify `vercel.json` has correct output directory:
```json
{
  "outputDirectory": ".next"
}
```

### Error: 404 on deployed URL

**Symptom:** Dashboard deploys but shows 404 error

**Solutions:**
1. Check if audit files are included in deployment:
   - Add `output/*.md` to git (if private repo)
   - Or configure Vercel to access parent directory files

2. Verify `audit-loader.ts` path resolution works in production

3. Check Vercel function logs for runtime errors

## Data Update Issues

### Dashboard shows old data after new audit

**Symptom:** Latest audit created but dashboard shows previous data

**Solutions:**
1. Verify new audit file is in `output/` directory

2. Check file naming follows pattern: `{brand}-audit-report-{date}.md`

3. Redeploy to Vercel:
   ```bash
   cd dashboard/
   vercel --prod
   ```

4. Wait for ISR revalidation (60 seconds) or force refresh in browser

### Multiple audits, dashboard shows wrong one

**Symptom:** Dashboard displays incorrect audit

**Solution:**
The dashboard automatically loads the LATEST audit (by filename sort). If you need specific audit:
1. Rename files to ensure correct sort order
2. Or modify `audit-loader.ts` to filter by brand/date

## Performance Issues

### Dashboard loads slowly

**Solutions:**
1. Check audit file size (parser performance degrades with very large files)

2. Optimize images in `public/` directory

3. Enable Vercel Analytics to identify bottlenecks

4. Consider pagination for historical audit views (future enhancement)

## Getting Help

If issues persist:

1. Check Next.js documentation: https://nextjs.org/docs
2. Check Vercel documentation: https://vercel.com/docs
3. Review audit file with `validate_audit.js` script
4. Check browser console for JavaScript errors
5. Review Vercel deployment logs for server-side errors
