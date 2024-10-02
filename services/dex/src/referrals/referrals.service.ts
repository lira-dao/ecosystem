import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq, or } from 'drizzle-orm';

@Injectable()
export class ReferralsService {
  private readonly logger = new Logger(ReferralsService.name);

  constructor(
    @Inject('DB_DEV') private drizzleDev: NodePgDatabase<typeof schema>,
  ) {}

  async getReferralsCount(address: string) {
    const firstLevelReferrals = await this.drizzleDev
      .select({ referral: schema.referral.referral })
      .from(schema.referral)
      .where(eq(schema.referral.referrer, address));

    const firstLevelCount = firstLevelReferrals.length;

    const firstLevelReferralAddresses = firstLevelReferrals.map(
      (ref) => ref.referral,
    );

    let secondLevelReferrals = [];
    if (firstLevelReferralAddresses.length > 0) {
      secondLevelReferrals = await this.drizzleDev
        .select({ referral: schema.referral.referral })
        .from(schema.referral)
        .where(
          firstLevelReferralAddresses
            .map((referralAddress) =>
              eq(schema.referral.referrer, referralAddress),
            )
            .reduce((acc, condition) => or(acc, condition)),
        );
    }

    const secondLevelCount = secondLevelReferrals.length;

    const secondLevelReferralAddresses = secondLevelReferrals.map(
      (ref) => ref.referral,
    );

    let thirdLevelReferrals = [];
    if (secondLevelReferralAddresses.length > 0) {
      thirdLevelReferrals = await this.drizzleDev
        .select({ referral: schema.referral.referral })
        .from(schema.referral)
        .where(
          secondLevelReferralAddresses
            .map((referralAddress) =>
              eq(schema.referral.referrer, referralAddress),
            )
            .reduce((acc, condition) => or(acc, condition)),
        );
    }

    const thirdLevelCount = thirdLevelReferrals.length;

    return {
      firstLevelCount,
      secondLevelCount,
      thirdLevelCount,
    };
  }
}
